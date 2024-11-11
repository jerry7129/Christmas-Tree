import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './Login.tsx'
import Signup from './Signup.tsx'
import CustomTree from './CustomTree.tsx'
import WriteLetter from './WriteLetter.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* 로그인 페이지 */}
        <Route path="/signup" element={<Signup />} /> {/* 회원가입 페이지 */}
        <Route path="/customtree" element={<CustomTree />} /> {/* 트리 수정 페이지 */}
        <Route path="/writeletter" element={<WriteLetter />} /> {/* 편지 쓰기 페이지 */}
      </Routes>
    </Router>
  )
}

export default App
