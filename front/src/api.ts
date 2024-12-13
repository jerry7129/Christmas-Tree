import {useAuth} from './context/AuthContext'

export const apiCall = async (
  url: string,
  options: RequestInit,
  onLogout: () => void,
  refreshToken: string | null
): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  })

  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(`https://${URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({refreshToken})
    })

    if (refreshResponse.ok) {
      const {accessToken} = await refreshResponse.json()
      localStorage.setItem('authToken', accessToken)
      return apiCall(url, options, onLogout, refreshToken) // 재시도
    } else {
      onLogout()
      alert('세션이 만료되었습니다. 다시 로그인해주세요.')
      throw new Error('Session expired')
    }
  }

  return response
}
