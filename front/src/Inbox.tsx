import React, {useState, useEffect} from 'react'
import {useAuth} from './context/AuthContext'
import {useNavigate} from 'react-router-dom'
import {TiThMenu} from 'react-icons/ti'
import {apiCall} from './api'

interface Letter {
  sender: string
  content: string
  decorationType: string
  createdAt: string
}

export default function CustomTree() {
  const URL = process.env.REACT_APP_EC2_URI
  const {authToken, refreshToken, onLogout} = useAuth()
  const [showMenu, setShowMenu] = useState(false) // 메뉴 표시 여부
  const [username, setUsername] = useState('') // 유저 이름
  const [treeName, setTreeName] = useState('') // 트리 이름
  const [treeColor, setTreeColor] = useState('red') // 기본 트리 색상
  const [inbox, setInbox] = useState<Letter[]>()
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)

  const navigate = useNavigate()

  const handleMenuToggle = () => {
    setShowMenu(prev => !prev)
  }

  const getUserData = async () => {
    try {
      const response = await apiCall(
        `https://${URL}/api/mydata`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          }
        },
        onLogout,
        refreshToken
      )
      if (!response.ok) {
        throw new Error('유저 정보 불러오기 실패')
      }
      const data = await response.json()
      setUsername(data.username)
      setTreeName(data.tree.name)
      setTreeColor(data.tree.color)
      setInbox(data.letters)
    } catch (error) {
      alert(`${error}`)
    }
  }

  const handleCopyLink = /*async*/ () => {
    /*const curruntLink = window.location.href
    const link = curruntLink.replace(/\/customtree$/, `/writeletter/${username}`)
    try {
      await navigator.clipboard.writeText(link)
      alert('링크가 클립보드에 복사되었습니다.')
    } catch (error) {
      alert(error)
    }*/
    alert(
      '현재주소에 customtree를 writeletter/자신의username으로 바꾸세요 *https 변경 후 기능 업데이트 예정'
    )
  }

  useEffect(() => {
    if (authToken === null) return // 로딩 중, 아무 작업도 하지 않음
    if (!authToken) {
      navigate('/') // 로그인 페이지로 이동
      return
    }
    getUserData()
  }, [authToken, navigate])

  const logout = () => {
    onLogout()
    navigate('/')
  }

  if (authToken == null) {
    return <div>로딩 중......</div>
  }

  if (!authToken) {
    return <div>로그인 해주세요.</div>
  }

  return (
    <div className="page">
      {/* 메뉴 버튼 */}
      <TiThMenu
        className="menuButton"
        size="50px"
        color="white"
        onClick={handleMenuToggle}
      />
      {showMenu && (
        <div className="menuList">
          {!!authToken ? (
            <>
              <button onClick={() => navigate('/customtree')}>트리 수정하기</button>
              <button onClick={() => handleCopyLink()}>링크 공유하기</button>
              <button onClick={() => logout()}>로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/')}>로그인</button>
              <button onClick={() => navigate('/signup')}>회원가입</button>
            </>
          )}
        </div>
      )}

      <div style={{textAlign: 'center'}}>
        <h2 style={{color: 'yellow'}}>{treeName} 의 트리</h2>
        <h4 style={{color: treeColor}}>색상: {treeColor}</h4>
      </div>

      {/* 트리 이미지 */}
      <div className="treeWrap">
        <img
          src="/images/christmasTree.png"
          style={{
            filter: `hue-rotate(${
              treeColor === 'red'
                ? '0deg'
                : treeColor === 'blue'
                ? '180deg'
                : treeColor === 'purple'
                ? '270deg'
                : '90deg'
            })`
          }}
          alt="크리스마스 트리"
        />
      </div>

      {/* 받은 편지함 */}
      <div className="inboxSection">
        <h3>받은 편지함</h3>
        <div className="inboxContainer">
          {inbox?.map((letter, index) => (
            <button
              key={index}
              className={`letterIcon ${letter.decorationType}`}
              onClick={() => setSelectedLetter(letter)}>
              {letter.decorationType === 'ball' && '🔴'}
              {letter.decorationType === 'bell' && '🔔'}
              {letter.decorationType === 'star' && '⭐'}
            </button>
          ))}
        </div>
      </div>

      {/* 편지 팝업 */}
      {selectedLetter && (
        <div className="letterPopup">
          <h4>보낸이: {selectedLetter.sender}</h4>
          <p>{selectedLetter.content}</p>
          <p style={{fontSize: 'small', color: 'gray'}}>
            작성일: {new Date(selectedLetter.createdAt).toLocaleString()}
          </p>
          <button onClick={() => setSelectedLetter(null)}>닫기</button>
        </div>
      )}
    </div>
  )
}
