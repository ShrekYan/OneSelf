import { runInAction } from 'mobx'
import { useLocalObservable } from 'mobx-react'

export interface MobxStoreType {
  isLoading: boolean
  userInfo: Record<string, any> | null
  token: string
  setLoading: (value: boolean) => void
  setUserInfo: (info: Record<string, any> | null) => void
  setToken: (token: string) => void
  reset: () => void
}

type UseMobxStoreType = () => MobxStoreType

const useMobxStore: UseMobxStoreType = () => {
  const store = useLocalObservable<MobxStoreType>(() => ({
    isLoading: false,
    userInfo: null,
    token: '',

    setLoading(value: boolean) {
      runInAction(() => {
        store.isLoading = value
      })
    },

    setUserInfo(info: Record<string, any> | null) {
      runInAction(() => {
        store.userInfo = info
      })
    },

    setToken(token: string) {
      runInAction(() => {
        store.token = token
      })
    },

    reset() {
      runInAction(() => {
        store.isLoading = false
        store.userInfo = null
        store.token = ''
      })
    }
  }))

  return store
}

export default useMobxStore
