import React, {useState, useEffect} from 'react'
import {useAuth} from './context/AuthContext'
import {useNavigate} from 'react-router-dom'
import {apiCall} from './api'
import Menu from './Menu'

interface Letter {
  sender: string
  content: string
  decorationType: string
  createdAt: string
  position: {x: number; y: number} // 오너먼트 위치
}

export default function CustomTree() {
  const URL = process.env.REACT_APP_EC2_URI
  const {authToken, refreshToken, onLogout} = useAuth()
  const [username, setUsername] = useState('') // 유저 이름
  const [treeName, setTreeName] = useState('') // 트리 이름
  const [treeColor, setTreeColor] = useState('red') // 기본 트리 색상
  const [inbox, setInbox] = useState<Letter[]>()
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)

  const navigate = useNavigate()

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

  useEffect(() => {
    if (authToken === null) return // 로딩 중, 아무 작업도 하지 않음
    if (!authToken) {
      navigate('/') // 로그인 페이지로 이동
      return
    }
    getUserData()
  }, [authToken, navigate])

  if (authToken == null) {
    return <div>로딩 중......</div>
  }

  if (!authToken) {
    return <div>로그인 해주세요.</div>
  }

  return (
    <div className="page">
      {/* 메뉴 버튼 */}
      <Menu username={username} menuType="inbox" />

      <div className="treeWrap">
        <div style={{textAlign: 'center'}}>
          <h2 style={{color: 'yellow', marginTop: 10, marginBottom: 0}}>
            {treeName} 의 트리
          </h2>
          <h4 style={{color: treeColor, marginTop: 0, marginBottom: 10}}>
            색상: {treeColor}
          </h4>
          <h5 style={{color: 'white', margin: 0}}>
            {inbox ? inbox.length : 0}개의 편지가 왔어요!
          </h5>
        </div>

        {/* 트리 이미지 */}
        <div className="treeContainer" style={{position: 'relative'}}>
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
              })`,
              position: 'relative'
            }}
            alt="크리스마스 트리"
          />
          {/* 트리에 오너먼트 추가 */}

          {inbox?.map((letter, index) => (
            <button
              key={index}
              className={`ornament`}
              style={{
                position: 'absolute',
                top: letter.position ? `${letter.position.y}px` : '50px',
                left: letter.position ? `${letter.position.x}px` : '50px',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedLetter(letter)}>
              {letter.decorationType}
            </button>
          ))}
        </div>
      </div>

      {/* 받은 편지함*/}
      <div className="inboxSection">
        <h4 style={{margin: '5px'}}>받은 편지함</h4>
        <div className="inboxContainer">
          {inbox?.map((letter, index) => (
            <button
              key={index}
              className={`letterIcon ${letter.decorationType}`}
              onClick={() => setSelectedLetter(letter)}>
              {letter.decorationType}
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
