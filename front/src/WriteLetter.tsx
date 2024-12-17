import React, {useState, useEffect, useRef} from 'react'
import {useParams} from 'react-router-dom'
import Menu from './Menu'
import resolveCollsision from './utils/HandleCollision'
import GraphemeSplitter from 'grapheme-splitter'

interface Letter {
  sender: string
  content: string
  decorationType: string
  createdAt: string
  isPrivate: boolean
  position: {x: number; y: number} // 오너먼트 위치
}

const ORNAMENT_SIZE = 16 // css에 맞춰주기

export default function WriteLetter() {
  const URL = process.env.REACT_APP_EC2_URI
  const {username} = useParams<{username: string}>() // 수신자 이름
  const [showNotepad, setShowNotepad] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)

  const [sender, setSender] = useState<string>('') // 발신자 이름
  const [content, setContent] = useState<string>('') // 발신자 편지
  const [decorationType, setDecorationType] = useState<string>('') // 편지 장식 종류
  const [isPrivate, setIsPrivate] = useState<boolean>(false) // 편지 공개 여부
  const ornamentPositionRef = useRef<{x: number; y: number} | null>(null)
  const [ornamentPosition, setOrnamentPosition] = useState<{x: number; y: number} | null>(
    null
  )

  const [treeName, setTreeName] = useState('My Tree') // 트리 이름
  const [treeColor, setTreeColor] = useState('red') // 기본 트리 색상

  const treeRef = useRef<HTMLDivElement>(null) // 트리 컨테이너 참조
  const [inbox, setInbox] = useState<Letter[]>([]) // 받은 편지함
  const [dragOffset, setDragOffset] = useState<{x: number; y: number} | null>(null)
  const [isEditting, setIsEditting] = useState<boolean>(false)
  const [isMoving, setIsMoving] = useState<boolean>(false)

  const splitter = new GraphemeSplitter() // 이모지 분리기

  // 필요한 유저 정보 가져오기
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

  // 편지 작성 및 저장 관련 함수
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
        body: JSON.stringify({
          sender,
          content,
          decorationType,
          isPrivate,
          position: ornamentPosition
        })
      })
      if (!response.ok) {
        throw new Error('편지 전송 실패')
      }
      alert('편지가 성공적으로 전송되었습니다.')
    } catch (error) {
      alert(`${error}`)
    }
    setSender('')
    setContent('')
    setDecorationType('')
    setIsPrivate(false)
    setOrnamentPosition(null)
    setIsEditting(false)
  }

  // 오너먼트 이동 관련 함수

  // 오너먼트를 <button>으로 만들었기 때문에
  // handleMouseDown, handleTouchstart, handleTouchMove의 이벤트는 HTMLButtonElement 타입을 가져야함.
  // treeRef는 HTMLDivElement

  // 마우스, 터치 이벤트 공통 함수
  // 이동 시작
  const handleStart = (clientX: number, clientY: number) => {
    setIsMoving(true)
    if (treeRef.current) {
      const rect = treeRef.current.getBoundingClientRect() // 트리 컨테이너의 좌표

      if (!ornamentPosition) {
        const currentX = rect.width / 2
        const currentY = rect.height / 2
        setDragOffset({
          x: clientX - rect.left - currentX,
          y: clientY - rect.top - currentY
        })
      } else {
        setDragOffset({
          x: clientX - rect.left - ornamentPosition.x,
          y: clientY - rect.top - ornamentPosition.y
        })
      }
    }
  }

  // 이동 중
  const handleMove = (clientX: number, clientY: number) => {
    if (dragOffset && treeRef.current) {
      const rect = treeRef.current.getBoundingClientRect()
      const newPosition = {
        x: clientX - rect.left - dragOffset.x,
        y: clientY - rect.top - dragOffset.y
      }

      if (newPosition.x < ORNAMENT_SIZE / 2) {
        newPosition.x = ORNAMENT_SIZE / 2
      } else if (newPosition.x > rect.width - ORNAMENT_SIZE / 2) {
        newPosition.x = rect.width - ORNAMENT_SIZE / 2
      }

      if (newPosition.y < ORNAMENT_SIZE / 2) {
        newPosition.y = ORNAMENT_SIZE / 2
      } else if (newPosition.y > rect.height - ORNAMENT_SIZE / 2) {
        newPosition.y = rect.height - ORNAMENT_SIZE / 2
      }

      ornamentPositionRef.current = newPosition
      setOrnamentPosition(newPosition)
    }
  }

  // 이동 완료
  const handleEnd = () => {
    if (ornamentPositionRef.current) {
      const safePosition = resolveCollsision(inbox, ornamentPositionRef.current)
      ornamentPositionRef.current = safePosition
      setOrnamentPosition(safePosition) // 충돌 방지 후 위치 설정
    }
    setDragOffset(null)
    setIsMoving(false)
  }

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  const preventScroll = (e: TouchEvent) => {
    if (isMoving) e.preventDefault() // 드래그 중 화면 이동 방지
  }

  // 오너먼트 위치 변경 시작
  const handleOrnament = () => {
    setShowNotepad(false)
    setIsEditting(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // 그래핀 클러스터 단위로 나눔
    const graphemes = splitter.splitGraphemes(value)

    // 이모지 하나만 입력되도록 설정
    if (graphemes.length <= 1) {
      setDecorationType(value)
    }
  }

  useEffect(() => {
    getUserData()
  }, [username, isEditting])

  // 데스크톱 마우스 이벤트 리스너 추가
  useEffect(() => {
    if (isMoving) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isMoving])

  useEffect(() => {
    if (isEditting) {
      window.addEventListener('touchmove', preventScroll, {passive: false})
    }
    return () => {
      window.removeEventListener('touchmove', preventScroll)
    }
  })

  return (
    <div className="page">
      {/* 메뉴 버튼 */}
      <Menu username={username ?? ''} menuType="writeletter" />
      <div className="treeWrap">
        <h2 style={{color: 'yellow', margin: 10}}>{treeName}의 트리</h2>
        <h5 style={{color: 'white', margin: 0}}>{inbox.length}개의 편지가 왔어요!</h5>
        {/* 트리 이미지 */}
        <div ref={treeRef} className="treeContainer" style={{position: 'relative'}}>
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

          {inbox.map((letter, index) => (
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
          {isEditting && (
            <button
              className={`ornament additional`}
              style={{
                position: 'absolute',
                top: ornamentPosition ? `${ornamentPosition.y}px` : '50%',
                left: ornamentPosition ? `${ornamentPosition.x}px` : '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer'
              }}
              onMouseDown={e => handleMouseDown(e)}
              onTouchStart={e => handleTouchStart(e)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}>
              {decorationType}
            </button>
          )}
        </div>
        {isEditting && (
          <button onClick={handleSaveLetter} style={{marginBottom: '10px'}}>
            위치 선택 완료
          </button>
        )}
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
          <div style={{margin: 0}}>
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
          </div>

          <div style={{margin: 0}}>오너먼트 타입 선택</div>
          <div className="decorationSelector">
            <button onClick={() => setDecorationType('🔴')}>🔴</button>
            <button onClick={() => setDecorationType('🔔')}>🔔</button>
            <button onClick={() => setDecorationType('⭐')}>⭐</button>
            <div style={{marginTop: 5}}>
              <text>사용자 지정: </text>
              <input
                type="text"
                maxLength={20} // 이모지 1~2글자로 제한
                placeholder="이모지만 가능"
                onChange={handleInputChange}
                value={decorationType}
                style={{width: '120px', marginLeft: '10px', textAlign: 'center'}}
              />
            </div>
          </div>
          <label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
            />
            익명
          </label>
          <button onClick={handleOrnament}>완료 및 위치 선택</button>
          <button onClick={() => setShowNotepad(false)}>취소</button>
        </div>
      )}
    </div>
  )
}
