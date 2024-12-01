import React from 'react'
import {AuthProvider} from './context/AuthContext'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import CustomTree from './CustomTree'
import WriteLetter from './WriteLetter'
import {PrivateRoute} from './PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> {/* 로그인 페이지 */}
          <Route path="/signup" element={<Signup />} /> {/* 회원가입 페이지 */}
          <Route
            path="/customtree"
            element={
              <PrivateRoute>
                <CustomTree />
              </PrivateRoute>
            }
          />
          {/* 트리 수정 페이지 */}
          <Route path="/writeletter/:username" element={<WriteLetter />} />
          {/* 편지 쓰기 페이지 }*/}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
