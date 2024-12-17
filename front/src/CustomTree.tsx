import React, {useState, useEffect} from 'react'
import {useAuth} from './context/AuthContext'
import {useNavigate} from 'react-router-dom'
import {apiCall} from './api'
import Menu from './Menu'

export default function CustomTree() {
  const URL = process.env.REACT_APP_EC2_URI
  const {authToken, refreshToken, onLogout} = useAuth()
  const [username, setUsername] = useState('') // 유저 이름
  const [treeName, setTreeName] = useState('') // 트리 이름
  const [treeColor, setTreeColor] = useState('red') // 기본 트리 색상
  const [isEditting, setIsEditting] = useState(true)

  const navigate = useNavigate()

  const handleSaveChanges = async () => {
    try {
      if (treeName == '') {
        throw new Error('공백은 트리 이름이 될 수 없습니다.')
      }
      setTreeName(treeName)
      const response = await apiCall(
        `https://${URL}/api/mydata/tree`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({name: treeName, color: treeColor})
        },
        onLogout,
        refreshToken
      )
      if (!response.ok) {
        throw new Error('변경사항 저장 실패')
      }
      alert(`변경사항이 저장되었습니다: 트리 이름 "${treeName}", 색상 "${treeColor}"`)
      navigate('/inbox')
    } catch (error) {
      alert(`${error}`)
    }
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

  if (authToken == null) {
    return <div>로딩 중......</div>
  }

  if (!authToken) {
    return <div>로그인 해주세요.</div>
  }

  return (
    <div className="page">
      {/* 메뉴 버튼 */}
      <Menu username={username ?? ''} menuType="customtree" />

      {/* 트리 이미지 */}
      <div className="treeWrap">
        {/* 트리 이름 입력 */}
        <div className="treeName">
          <input
            type="text"
            value={treeName}
            onChange={e => setTreeName(e.target.value)}
            style={{
              width: '30%',
              height: '30px',
              textAlign: 'center',
              fontSize: '1.5em',
              fontWeight: 'bold'
            }}
          />
          <span
            style={{
              color: 'yellow',
              fontSize: '1.5em',
              fontWeight: 'bold',
              marginLeft: '4px'
            }}>
            의 트리
          </span>
        </div>
        <h4 style={{color: treeColor, marginTop: 0, marginBottom: 10}}>
          색상: {treeColor}
        </h4>
        <div className="treeContainer">
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
      </div>

      <div className="colorButtons">
        <button style={{backgroundColor: 'red'}} onClick={() => setTreeColor('red')} />
        <button style={{backgroundColor: 'blue'}} onClick={() => setTreeColor('blue')} />
        <button
          style={{backgroundColor: 'purple'}}
          onClick={() => setTreeColor('purple')}
        />
        <button
          style={{backgroundColor: 'green'}}
          onClick={() => setTreeColor('green')}
        />
      </div>

      <button onClick={() => handleSaveChanges()}>변경완료</button>
    </div>
  )
}
