import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react'

// 인증 상태와 관련된 인터페이스
interface AuthContextType {
  authToken: string | undefined
  onLogin: (token: string) => void
  onLogout: () => void
}

// 기본값 설정
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Context Provider 컴포넌트 정의
export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined)

  // 초기화 로직: LocalStorage에서 토큰 복원
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      setAuthToken(token)
    }
  }, [])

  // 로그인 함수
  const onLogin = (authToken: string) => {
    setAuthToken(authToken)
    localStorage.setItem('authToken', authToken) // 로컬 스토리지에 사용자 정보 저장
  }

  // 로그아웃 함수
  const onLogout = () => {
    setAuthToken('')
    localStorage.removeItem('authToken') // 로컬 스토리지에서 사용자 정보 제거
  }

  if (authToken == undefined) {
    return <div>로딩 중...</div>
  }

  return (
    <AuthContext.Provider value={{authToken, onLogin, onLogout}}>
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
