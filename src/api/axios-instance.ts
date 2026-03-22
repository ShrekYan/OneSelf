import axios, { type AxiosInstance  , type AxiosResponse, type AxiosError } from 'axios'
import { Toast } from 'antd-mobile'
import type { ApiResponse, RequestConfig } from './types'
import { ApiError, ErrorType } from './types'
import { RequestCache } from './request-cache'
import { CancelManager } from './cancel-manager'

// 创建缓存和取消管理器实例
const cache = new RequestCache()
const cancelManager = new CancelManager()

// 从环境变量获取基础 URL
const getBaseURL = () => {
  // @ts-ignore - import.meta 使用需要特殊配置
  return (import.meta.env as any).VITE_API_BASE_URL || '/api'
}

// 从环境变量判断是否为开发环境
const isDev = () => {
  // @ts-ignore
  return (import.meta.env as any).DEV === true
}

/**
 * 创建 API 实例
 */
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

/**
 * 处理业务错误
 * @param data - 响应数据
 * @param config - 请求配置
 */
function handleBusinessError(data: any, config: RequestConfig) {
  const apiError = new ApiError(
    data.message || '请求失败',
    ErrorType.BUSINESS,
    data.code,
    undefined
  )

  if (!config.skipErrorToast) {
    Toast.show({
      icon: 'fail',
      content: data.message || '请求失败',
    })
  }

  // 特殊错误码处理
  if (data.code === 401 || data.code === 1001) {
    // 未授权，清除 token 并跳转登录
    localStorage.removeItem('token')
    // TODO: 跳转登录页
  }

  return Promise.reject(apiError)
}

/**
 * 处理 HTTP 错误
 * @param error - 错误对象
 */
function handleHttpError(error: any) {
  const config = error.config as RequestConfig
  const response = error.response

  // 缓存数据
  if (error._isCache) {
    return error.data
  }

  // 开发环境日志
  if (isDev()) {
    console.error('[API Response Error]', error)
  }

  // 请求被取消
  if (axios.isCancel(error)) {
    return Promise.reject(new ApiError(error.message, ErrorType.ABORT))
  }

  // 网络错误
  if (!response) {
    const message = error.message || '网络连接失败'
    Toast.show({
      icon: 'fail',
      content: message,
    })
    return Promise.reject(new ApiError(message, ErrorType.NETWORK))
  }

  // 状态码错误处理
  return handleStatusError(error, config)
}

/**
 * 处理状态码错误
 * @param error - 错误对象
 * @param config - 请求配置
 * @returns Promise，支持重试逻辑
 */
async function handleStatusError(error: any, config: RequestConfig) {
  const { status, data } = error.response
  let errorType = ErrorType.SERVER
  let errorMessage = data?.message || '请求失败'

  switch (status) {
    case 401:
      errorType = ErrorType.UNAUTHORIZED
      errorMessage = '未授权，请重新登录'
      localStorage.removeItem('token')
      // TODO: 跳转登录页
      break
    case 403:
      errorType = ErrorType.FORBIDDEN
      errorMessage = '无权访问'
      break
    case 404:
      errorType = ErrorType.NOT_FOUND
      errorMessage = '请求的资源不存在'
      break
    case 408:
    case 504:
      errorType = ErrorType.TIMEOUT
      errorMessage = '请求超时'
      break
    case 500:
    case 502:
    case 503:
      errorType = ErrorType.SERVER
      errorMessage = '服务器错误'
      break
  }

  if (!config?.skipErrorToast) {
    Toast.show({
      icon: 'fail',
      content: errorMessage,
    })
  }

  // 重试逻辑
  const retryCount = config?.retry ?? 0
  const currentRetry = (config as any).__retryCount ?? 0

  if (
    currentRetry < retryCount &&
    [408, 500, 502, 503, 504].includes(status)
  ) {
    (config as any).__retryCount = currentRetry + 1
    const delay = config?.retryDelay || 1000
    await new Promise((resolve) => setTimeout(resolve, delay))
    return api(config)
  }

  return Promise.reject(new ApiError(errorMessage, errorType, status, error))
}

/**
 * 请求拦截器
 */
api.interceptors.request.use(
  (config: RequestConfig) => {
    // 开发环境日志
    if (isDev()) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config)
    }

    // 处理缓存
    const cacheKey = `${config.url}-${JSON.stringify(config.params)}`
    if (config.cache && config.method === 'get') {
      const cachedData = cache.get(cacheKey)
      if (cachedData) {
        console.log(`[API Cache] Using cached data for ${config.url}`)
        return Promise.reject({ _isCache: true, data: cachedData })
      }
    }

    // 请求取消 - 防止重复请求
    const source = axios.CancelToken.source()
    config.cancelToken = source.token
    cancelManager.addRequest(config, source)

    // 添加认证 token
    if (!config.skipAuth) {
      const token = localStorage.getItem('token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // 添加时间戳
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    return config as any
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data, config } = response

    // 开发环境日志
    if (isDev()) {
      console.log(`[API Response] ${config.url}`, data)
    }

    // 业务成功
    if (data.code === 200 || data.code === 0) {
      // 缓存响应
      if ((config as RequestConfig).cache && config.method === 'get') {
        const cacheKey = `${config.url}-${JSON.stringify(config.params)}`
        const cacheTime = (config as RequestConfig).cacheTime || 60000
        cache.set(cacheKey, data.data, cacheTime)
      }
      return data.data
    }

    // 业务错误
    return handleBusinessError(data, config as RequestConfig)
  },
  handleHttpError
)

export default api
export { cache, cancelManager }
