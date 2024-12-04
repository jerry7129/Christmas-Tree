import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react'

// 인증 상태와 관련된 인터페이스
interface AuthContextType {
  authToken: string | null
  refreshToken: string | null
  onLogin: (authToken: string, refreshToken: string) => void
  onLogout: () => void
}

// 기본값 설정
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Context Provider 컴포넌트 정의
export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  // 초기화 로직: LocalStorage에서 토큰 복원
  useEffect(() => {
    const storedAuthToken = localStorage.getItem('authToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    if (storedAuthToken && storedRefreshToken) {
      setAuthToken(storedAuthToken)
      setRefreshToken(storedRefreshToken)
    }
    console.log('hi')
  }, [])

  // 로그인 함수
  const onLogin = (authToken: string, refreshToken: string) => {
    setAuthToken(authToken)
    setRefreshToken(refreshToken)
    localStorage.setItem('authToken', authToken) // localStorage에 accessToken 저장
    localStorage.setItem('refreshToken', refreshToken) // localStorage에 refreshToken 저장
  }

  // 로그아웃 함수
  const onLogout = () => {
    setAuthToken(null)
    setRefreshToken(null)
    localStorage.removeItem('authToken') // localStorage에서 accessToken 제거
    localStorage.removeItem('refreshToken') // localStorage에서 refreshToken 제거
  }

  return (
    <AuthContext.Provider value={{authToken, refreshToken, onLogin, onLogout}}>
      {children}
    </AuthContext.Provider>
  )
}

// Context를 사용하는 커스텀 Hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
