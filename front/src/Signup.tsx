import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom' // useNavigate 훅 import
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai'

export default function Signup() {
  const navigate = useNavigate()
  const URL = process.env.REACT_APP_EC2_URI
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({username: '', password: '', confirmPassword: ''})
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)

  const [hide, setHide] = useState<Array<boolean>>([true, true])

  // 회원가입 요청 함수
  const signup = async (username: string, password: string) => {
    const response = await fetch(`https://${URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })

    console.log('응답 상태:', response.status)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    return await response.json()
  }

  // 회원가입 버튼 클릭 시 처리 함수
  const handleSignup = async () => {
    if (!isButtonEnabled) {
      alert('입력값을 다시 확인해주세요.')
      return
    }

    try {
      await signup(username, password)
      alert('회원가입 성공!')
      goToLogin()
    } catch (error) {
      alert(`회원가입 실패!: ${(error as Error).message}`)
    }
  }

  // 로그인 페이지로 이동하는 함수
  const goToLogin = () => {
    navigate('/') // '/' 경로로 이동
  }

  // 비밀번호 유효성 검사 정규식
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

  // 유효성 검사 함수들
  const validateUsername = (value: string) => {
    if (!value) {
      setErrors(prev => ({...prev, username: '아이디를 입력해주세요.'}))
    } else {
      setErrors(prev => ({...prev, username: ''}))
    }
  }

  const validatePassword = (value: string) => {
    if (!passwordRegex.test(value)) {
      setErrors(prev => ({
        ...prev,
        password: '영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.'
      }))
    } else {
      setErrors(prev => ({...prev, password: ''}))
    }
  }

  const validateConfirmPassword = (value: string) => {
    if (value !== password) {
      setErrors(prev => ({...prev, confirmPassword: '비밀번호가 일치하지 않습니다.'}))
    } else {
      setErrors(prev => ({...prev, confirmPassword: ''}))
    }
  }

  // 입력값 유효성 검사 후 버튼 활성화 상태 업데이트
  useEffect(() => {
    setIsButtonEnabled(
      username !== '' && passwordRegex.test(password) && confirmPassword === password
    )
  }, [username, password, confirmPassword])

  return (
    <div className="page">
      <div className="titleWrap">
        <p>크리스마스 트리 만들기</p>
      </div>

      <div className="loginWrap">
        <div className="inputTitle">아이디</div>
        <div className="inputWrap">
          <input
            className="input"
            type="text"
            value={username}
            onChange={e => {
              setUsername(e.target.value)
              validateUsername(e.target.value)
            }}
            placeholder="아이디를 입력하세요"
          />
        </div>
        {/* 아이디 에러 메시지 */}
        {errors.username && <div className="errorMessageWrap">{errors.username}</div>}

        <div className="inputTitle">비밀번호</div>
        <div className="inputWrap">
          <input
            className="input"
            type={hide[0] ? 'password' : 'text'}
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              validatePassword(e.target.value)
            }}
            placeholder="비밀번호를 입력하세요"
          />
          <div className="passwordIcon" onClick={() => setHide([!hide[0], hide[1]])}>
            {hide[0] ? <AiFillEyeInvisible /> : <AiFillEye />}
          </div>
        </div>
        {/* 비밀번호 에러 메시지 */}
        {errors.password && <div className="errorMessageWrap">{errors.password}</div>}

        <div className="inputTitle">비밀번호 확인</div>
        <div className="inputWrap">
          <input
            className="input"
            type={hide[1] ? 'password' : 'text'}
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value)
              validateConfirmPassword(e.target.value)
            }}
            placeholder="비밀번호를 다시 입력하세요"
          />
          <div className="passwordIcon" onClick={() => setHide([hide[0], !hide[1]])}>
            {hide[1] ? <AiFillEyeInvisible /> : <AiFillEye />}
          </div>
        </div>
        {/* 비밀번호 확인 에러 메시지 */}
        {errors.confirmPassword && (
          <div className="errorMessageWrap">{errors.confirmPassword}</div>
        )}

        <div>
          <button
            className="loginButton"
            onClick={handleSignup}
            disabled={!isButtonEnabled} // 버튼 활성화/비활성화
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}
