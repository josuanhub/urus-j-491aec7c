import { useState, useCallback } from 'react'

const API_BASE = 'https://www.urusverify.com/v1/client/491aec7c-4945-4267-8778-b3719e15951f/api'
const FACTORY_KEY = 'factory2026'

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-factory-key': FACTORY_KEY,
      ...options.headers
    }
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(errorData.message || `HTTP error ${response.status}`)
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchApi(endpoint, options)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const get = useCallback((endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'GET' })
  }, [request])

  const post = useCallback((endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'POST', body })
  }, [request])

  const put = useCallback((endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'PUT', body })
  }, [request])

  const patch = useCallback((endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'PATCH', body })
  }, [request])

  const del = useCallback((endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'DELETE' })
  }, [request])

  return { loading, error, request, get, post, put, patch, del }
}