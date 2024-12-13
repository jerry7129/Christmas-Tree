import React, {useState, useEffect} from 'react'
import {useAuth} from './context/AuthContext'
import {useNavigate, useParams} from 'react-router-dom'
import {TiThMenu} from 'react-icons/ti'

interface Letter {
  sender: string
  content: string
  decorationType: string
  createdAt: string
  isPrivate: boolean
}

export default function WriteLetter() {
  const URL = process.env.REACT_APP_EC2_URI
  const {username} = useParams<{username: string}>() // 수신자 이름
  const {authToken, refreshToken, onLogout} = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [showNotepad, setShowNotepad] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)

  const [sender, setSender] = useState<string>('') // 발신자 이름
  const [content, setContent] = useState<string>('') // 발신자 편지
  const [decorationType, setDecorationType] = useState<string>('ball') // 편지 장식 종류
  const [isPrivate, setIsPrivate] = useState<boolean>(false) // 편지 공개 여부

  const [treeName, setTreeName] = useState('My Tree') // 트리 이름
  const [treeColor, setTreeColor] = useState('red') // 기본 트리 색상
  const [inbox, setInbox] = useState<Letter[]>([]) // 받은 편지함

  const navigate = useNavigate()

  const getUserData = async () => {
    try {
      const response = await fetch(`https://${URL}/api/letter/get/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('유저 정보 불러오기 실패')
      }
      const data = await response.json()
      setTreeName(data.tree.name)
      setTreeColor(data.tree.color)
      setInbox(data.letters)
    } catch (error) {
      alert(`${error}`)
    }
  }

  const handleMenuToggle = () => {
    setShowMenu(prev => !prev)
  }

  const handleWriteLetter = () => {
    setShowNotepad(true)
  }

  const handleSaveLetter = async () => {
    try {
      const response = await fetch(`https://${URL}/api/letter/send/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({sender, content, decorationType, isPrivate})
      })
      if (!response.ok) {
        throw new Error('편지 전송 실패')
      }
      alert('편지가 성공적으로 전송되었습니다.')
    } catch (error) {
      alert(`${error}`)
    }
    setShowNotepad(false)
  }

  const logout = () => {
    onLogout()
    navigate('/')
  }

  useEffect(() => {
    getUserData()
  }, [username, showNotepad])

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
          <button onClick={() => alert('링크 공유하기')}>링크 공유하기</button>
          {authToken ? (
            <button onClick={() => logout()}>로그아웃</button>
          ) : (
            <button onClick={() => navigate('/')}>로그인</button>
          )}
        </div>
      )}

      {/* 트리 이미지 */}
      <div className="treeWrap">
        <h2 style={{color: 'yellow'}}>{treeName}의 트리</h2>
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
      </div>

      {selectedLetter && (
        <div className="letterPopup">
          <h4>보낸이: {selectedLetter.isPrivate ? '익명' : selectedLetter.sender}</h4>
          <p>{selectedLetter.content}</p>
          <p style={{fontSize: 'small', color: 'gray'}}>
            작성일: {new Date(selectedLetter.createdAt).toLocaleString()}
          </p>
          <button onClick={() => setSelectedLetter(null)}>닫기</button>
        </div>
      )}

      {/* 편지 쓰기 버튼 */}
      <button className="writeLetterButton" onClick={handleWriteLetter}>
        편지쓰기
      </button>

      {/* 메모장 팝업 */}
      {showNotepad && (
        <div className="notepadPopup">
          <input
            className="input"
            value={sender}
            placeholder="발신인 이름"
            onChange={e => setSender(e.target.value)}></input>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="편지를 작성하세요..."
          />
          <div className="decorationSelector">
            <button onClick={() => setDecorationType('ball')}>🔴</button>
            <button onClick={() => setDecorationType('bell')}>🔔</button>
            <button onClick={() => setDecorationType('star')}>⭐</button>
          </div>
          <button
            onClick={() => {
              setIsPrivate(!isPrivate)
            }}>
            {isPrivate ? '익명 해제' : '익명'}
          </button>
          <button onClick={handleSaveLetter}>완료</button>
        </div>
      )}
    </div>
  )
}
