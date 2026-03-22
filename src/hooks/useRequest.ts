import { useState, useEffect, useCallback } from 'react'

interface UseRequestOptions {
  manual?: boolean
  defaultData?: any
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  onFinally?: () => void
}

interface UseRequestReturn {
  data: any
  error: any
  loading: boolean
  run: (...args: any[]) => Promise<void>
  runAsync: (...args: any[]) => Promise<any>
  refresh: () => Promise<void>
  refreshAsync: () => Promise<any>
  cancel: () => void
}

const useRequest = (
  service: (...args: any[]) => Promise<any>,
  options: UseRequestOptions = {}
): UseRequestReturn => {
  const {
    manual = false,
    defaultData,
    onSuccess,
    onError,
    onFinally
  } = options

  const [data, setData] = useState(defaultData)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [aborted, setAborted] = useState(false)

  const run = useCallback(async (...args: any[]) => {
    try {
      setLoading(true)
      setError(null)
      setAborted(false)

      const result = await service(...args)

      if (!aborted) {
        setData(result)
        onSuccess?.(result)
      }

      return result
    } catch (err) {
      if (!aborted) {
        setError(err)
        onError?.(err)
      }
    } finally {
      if (!aborted) {
        setLoading(false)
        onFinally?.()
      }
    }
  }, [service, onSuccess, onError, onFinally, aborted])

  const runAsync = useCallback(
    async (...args: any[]) => {
      return run(...args)
    },
    [run]
  )

  const refresh = useCallback(() => run(), [run])
  const refreshAsync = useCallback(() => runAsync(), [runAsync])

  const cancel = useCallback(() => {
    setAborted(true)
    setLoading(false)
    setError(null)
  }, [])

  useEffect(() => {
    if (!manual) {
      run()
    }
  }, [])

  return {
    data,
    error,
    loading,
    run,
    runAsync,
    refresh,
    refreshAsync,
    cancel
  }
}

export default useRequest
