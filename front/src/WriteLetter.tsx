import React, {useState} from 'react'
import {TiThMenu} from 'react-icons/ti'
import {useNavigate} from 'react-router-dom'

export default function WriteLetter({treeName, treeColor}) {
  const [showMenu, setShowMenu] = useState(false)
  const [showNotepad, setShowNotepad] = useState(false)
  const [letter, setLetter] = useState('')

  const navigate = useNavigate()

  const handleMenuToggle = () => {
    setShowMenu(prev => !prev)
  }

  const handleWriteLetter = () => {
    setShowNotepad(true)
  }

  const handleSaveLetter = () => {
    alert(`편지가 저장되었습니다:\n\n"${letter}"`)
    setShowNotepad(false)
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
          <button onClick={() => alert('받은 편지함')}>받은 편지함</button>
          <button onClick={() => navigate('/customtree')}>색상 변경하기</button>
          <button onClick={() => alert('링크 공유하기')}>링크 공유하기</button>
        </div>
      )}

      {/* 트리 이미지 */}
      <div className="treeWrap">
        <h2 style={{color: 'yellow'}}>{treeName}의 트리</h2>
        <img
          src="images/christmasTree.png"
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

      {/* 편지 쓰기 버튼 */}
      <button className="writeLetterButton" onClick={handleWriteLetter}>
        편지쓰기
      </button>

      {/* 메모장 팝업 */}
      {showNotepad && (
        <div className="notepadPopup">
          <textarea
            value={letter}
            onChange={e => setLetter(e.target.value)}
            placeholder="편지를 작성하세요..."
          />
          <button onClick={handleSaveLetter}>완료</button>
        </div>
      )}
    </div>
  )
}
