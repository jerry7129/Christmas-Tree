import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {TiThMenu} from 'react-icons/ti'

export default function CustomTree() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 로그인 여부
  const [showMenu, setShowMenu] = useState(false) // 메뉴 표시 여부
  const [treeName, setTreeName] = useState('') // 트리 이름
  const [treeColor, setTreeColor] = useState('red') // 기본 트리 색상

  const navigate = useNavigate()

  const handleMenuToggle = () => {
    setShowMenu(prev => !prev)
  }

  const handleColorChange = color => {
    setTreeColor(color) // 트리 색상 변경
  }

  const handleSaveChanges = () => {
    alert(`변경사항이 저장되었습니다: 트리 이름 "${treeName}", 색상 "${treeColor}"`)
    // 여기에 저장 로직을 추가하세요.
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
          {isLoggedIn ? (
            <>
              <button onClick={() => alert('받은 편지함')}>받은 편지함</button>
              <button onClick={() => alert('색상 변경하기')}>색상 변경하기</button>
              <button onClick={() => alert('링크 공유하기')}>링크 공유하기</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/')}>로그인</button>
              <button onClick={() => navigate('/signup')}>회원가입</button>
            </>
          )}
        </div>
      )}

      {/* 트리 이름 입력 */}
      <div>
        <input className="treeName" placeholder="이름을 입력하세요" />
        <span style={{color: 'yellow'}}> 의 트리</span>
      </div>

      {/* 트리 이미지 */}
      <div className="treeWrap">
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

      {/* 색상 변경 버튼들 */}
      <div className="colorButtons">
        <button
          style={{backgroundColor: 'red'}}
          onClick={() => handleColorChange('red')}
        />
        <button
          style={{backgroundColor: 'blue'}}
          onClick={() => handleColorChange('blue')}
        />
        <button
          style={{backgroundColor: 'purple'}}
          onClick={() => handleColorChange('purple')}
        />
        <button
          style={{backgroundColor: 'green'}}
          onClick={() => handleColorChange('green')}
        />
      </div>

      {/* 변경 완료 버튼 */}
      <button onClick={handleSaveChanges}>변경완료</button>
    </div>
  )
}
