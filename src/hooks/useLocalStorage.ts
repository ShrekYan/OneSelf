import { useState, useEffect } from 'react'

interface UseLocalStorageOptions {
  serializer?: (value: any) => string
  deserializer?: (value: string) => any
}

const useLocalStorage = (
  key: string,
  initialValue: any,
  options: UseLocalStorageOptions = {}
): [any, (value: any) => void] => {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse
  } = options

  const readValue = (): any => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? deserializer(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }

  const [storedValue, setStoredValue] = useState(readValue)

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(deserializer(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, deserializer])

  const setValue = (value: any): void => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)
      window.localStorage.setItem(key, serializer(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
