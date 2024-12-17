import React, {useState} from 'react'
import {useAuth} from './context/AuthContext'
import {useNavigate} from 'react-router-dom'
import {TiThMenu} from 'react-icons/ti'
import ShareToClipboard from './utils/ShareToClipboard'
import ShareToKakao from './utils/ShareToKakao'

export default function Menu({username, menuType}: {username: string; menuType: string}) {
  const {authToken, onLogout} = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  const navigate = useNavigate()

  const handleMenuToggle = () => {
    setShowMenu(prev => !prev)
  }
  const logout = () => {
    onLogout()
    navigate('/')
  }

  function ExtraMenu() {
    switch (menuType) {
      case 'customtree':
        return <button onClick={() => navigate('/inbox')}>받은 편지함</button>
      case 'inbox':
        return <button onClick={() => navigate('/customtree')}>트리 수정하기</button>
      default:
        return null
    }
  }

  return (
    <div>
      <TiThMenu
        className="menuButton"
        size="50px"
        color="white"
        onClick={handleMenuToggle}
      />

      {showMenu && (
        <div className="menuList">
          <ExtraMenu />
          {username && <ShareToClipboard username={username} />}
          {username && <ShareToKakao username={username} />}
          {!!authToken ? (
            <button onClick={() => logout()}>로그아웃</button>
          ) : (
            <button onClick={() => navigate('/')}>로그인</button>
          )}
          <button onClick={() => navigate('/information')}>정보</button>
        </div>
      )}
    </div>
  )
}
