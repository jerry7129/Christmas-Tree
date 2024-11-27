import React from 'react'
import {Navigate} from 'react-router-dom'
import {useAuth} from './context/AuthContext'

export const PrivateRoute = ({children}: {children: React.ReactNode}) => {
  const {authToken} = useAuth()

  return authToken ? <>{children}</> : <Navigate to="/" replace />
}
