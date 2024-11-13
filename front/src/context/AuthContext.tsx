import React, {createContext, useContext, useState, ReactNode} from 'react'

// 사용자 정보 인터페이스 정의
interface User {
  username: string
}

// 인증 상태와 관련된 인터페이스
interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (username: string) => void
  logout: () => void
}

// 기본값 설정
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Context Provider 컴포넌트 정의
export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null)

  // 로그인 함수
  const login = (username: string) => {
    setUser({username})
    localStorage.setItem('user', username) // 로컬 스토리지에 사용자 정보 저장
  }

  // 로그아웃 함수
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user') // 로컬 스토리지에서 사용자 정보 제거
  }

  return (
    <AuthContext.Provider value={{user, isLoggedIn: !!user, login, logout}}>
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
