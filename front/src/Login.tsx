import React, {useState, useEffect} from 'react'
import {useAuth} from './context/AuthContext'
import {useNavigate} from 'react-router-dom'
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai'

export default function Login() {
  const navigate = useNavigate()

  const {login} = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({password: ''})
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)

  const [hide, setHide] = useState(true)

  // 예시 회원가입된 계정 정보
  const registeredUser = {
    username: 'testuser',
    password: 'Test@1234'
  }

  // 비밀번호 유효성 검사 정규식
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

  // 비밀번호 유효성 검사를 수행하는 함수
  const validatePassword = (value: string) => {
    if (!passwordRegex.test(value)) {
      setErrors({...errors, password: '영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.'})
    } else {
      setErrors({...errors, password: ''})
    }
  }

  // 아이디와 비밀번호 상태에 따라 로그인 버튼 활성화 상태를 업데이트
  useEffect(() => {
    setIsButtonEnabled(username !== '' && passwordRegex.test(password))
  }, [username, password])

  // 로그인 버튼 클릭 시 처리 함수
  const handleLogin = () => {
    if (
      /*username === registeredUser.username && password === registeredUser.password*/
      username
    ) {
      alert('로그인 성공!')
      login(username)
      navigate('/customtree')
    } else {
      alert('알맞는 회원 정보가 없습니다.')
    }
  }

  // 회원가입 페이지로 이동하는 함수
  const goToSignup = () => {
    navigate('/signup') // '/signup' 경로로 이동
  }

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
            onChange={e => setUsername(e.target.value)}
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div className="inputTitle">비밀번호</div>
        <div className="inputWrap">
          <input
            className="input"
            type={hide ? 'password' : 'text'}
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              validatePassword(e.target.value)
            }}
            placeholder="비밀번호를 입력하세요"
          />
          <div className="passwordIcon" onClick={() => setHide(!hide)}>
            {hide ? <AiFillEyeInvisible /> : <AiFillEye />}
          </div>
        </div>
        {/* 비밀번호 입력 시 조건을 충족하지 않으면 에러 메시지 표시 */}
        {errors.password && <div className="errorMessageWrap">{errors.password}</div>}

        <div>
          <button
            className="loginButton"
            onClick={handleLogin}
            disabled={!isButtonEnabled} // 버튼 활성화/비활성화
          >
            로그인
          </button>
        </div>

        <div className="signupPrompt">
          계정이 없으신가요?{' '}
          <span className="signupLink" onClick={goToSignup}>
            회원가입
          </span>
        </div>
      </div>
    </div>
  )
}
