import React, {useState, useEffect} from 'react'
import {useAuth} from './context/AuthContext'
import {useNavigate} from 'react-router-dom'
import {TiThMenu} from 'react-icons/ti'

export default function CustomTree() {
  const {authToken, onLogout} = useAuth()
  const [showMenu, setShowMenu] = useState(false) // 메뉴 표시 여부
  const [treeName, setTreeName] = useState('') // 트리 이름
  const [treeColor, setTreeColor] = useState('red') // 기본 트리 색상
  const [isEditting, setIsEditting] = useState(true)

  const navigate = useNavigate()

  const handleMenuToggle = () => {
    setShowMenu(prev => !prev)
  }

  const handleSaveChanges = async () => {
    try {
      if (treeName == '') {
        throw new Error('공백은 트리 이름이 될 수 없습니다.')
      }
      setTreeName(treeName)
      const response = await fetch('http://localhost:5000/api/mydata/tree', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({name: treeName, color: treeColor})
      })
      if (!response.ok) {
        throw new Error('변경사항 저장 실패')
      }
      alert(`변경사항이 저장되었습니다: 트리 이름 "${treeName}", 색상 "${treeColor}"`)
      setIsEditting(false)
    } catch (error) {
      alert(`${error}`)
    }
  }

  const getUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/mydata', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      })
      if (!response.ok) {
        throw new Error('유저 정보 불러오기 실패')
      }
      const data = await response.json()
      setTreeName(data.tree.name)
      setTreeColor(data.tree.color)
      setIsEditting(false)
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
              <button onClick={() => navigate('/inbox')}>받은 편지함</button>
              <button onClick={() => alert('링크 공유하기')}>링크 공유하기</button>
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

      {/* 변경/완료 구별 */}
      {isEditting ? (
        <>
          {/* 트리 이름 입력 */}
          <div>
            <input
              className="treeName"
              type="text"
              value={treeName}
              onChange={e => setTreeName(e.target.value)}
              placeholder="이름을 입력하세요"
            />
            <span style={{color: 'yellow'}}> 의 트리</span>
          </div>
        </>
      ) : (
        <div style={{textAlign: 'center'}}>
          <h2 style={{color: 'yellow'}}>{treeName} 의 트리</h2>
          <h4 style={{color: treeColor}}>색상: {treeColor}</h4>
        </div>
      )}

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

      {/* 색상 변경 버튼들 */}
      {isEditting && (
        <div className="colorButtons">
          <button style={{backgroundColor: 'red'}} onClick={() => setTreeColor('red')} />
          <button
            style={{backgroundColor: 'blue'}}
            onClick={() => setTreeColor('blue')}
          />
          <button
            style={{backgroundColor: 'purple'}}
            onClick={() => setTreeColor('purple')}
          />
          <button
            style={{backgroundColor: 'green'}}
            onClick={() => setTreeColor('green')}
          />
        </div>
      )}

      {/* 변경 완료 및 수정 버튼 */}
      {isEditting ? (
        <button onClick={() => handleSaveChanges()}>변경완료</button>
      ) : (
        <button onClick={() => setIsEditting(true)}>색상 변경</button>
      )}
    </div>
  )
}
