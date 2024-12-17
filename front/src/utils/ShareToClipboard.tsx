import React from 'react'

export default function ShareToClipboard({username}: {username: string}) {
  const handleClipboard = () => {
    navigator.clipboard
      .writeText(`https://www.mychristmastreeletter.com/writeletter/${username}`)
      .then(() => {
        alert('초대 링크가 복사되었습니다.')
      })
      .catch(err => {
        console.error('복사 실패:', err)
        alert('복사에 실패했습니다.')
      })
  }

  return <button onClick={handleClipboard}>클립보드로 복사하기</button>
}
