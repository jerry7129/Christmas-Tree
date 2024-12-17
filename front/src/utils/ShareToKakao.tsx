import React, {useEffect} from 'react'

export default function ShareToKakao({username}: {username: string}) {
  useEffect(() => {
    // 카카오 SDK 초기화
    const kakaoAppKey = 'YOUR_APP_KEY' // 카카오 디벨로퍼스 JavaScript 앱 키
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoAppKey)
      console.log('Kakao SDK Initialized:', window.Kakao.isInitialized())
    }
  }, [])

  const handleShareToKakao = () => {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '크리스마스 트리 꾸미기🎄',
        description: '크리스마스를 맞이해 친구들에게 편지를 써보세요!',
        imageUrl:
          'https://img.freepik.com/free-vector/christmas-tree-background-with-gifts_23-2148008972.jpg',
        link: {
          mobileWebUrl: `https://www.mychristmastreeletter.com/writeletter/${username}`,
          webUrl: `https://www.mychristmastreeletter.com/writeletter/${username}`
        }
      },
      buttons: [
        {
          title: '편지 쓰기',
          link: {
            mobileWebUrl: `https://www.mychristmastreeletter.com/writeletter/${username}`,
            webUrl: `https://www.mychristmastreeletter.com/writeletter/${username}`
          }
        }
      ]
    })
  }

  return <button onClick={handleShareToKakao}>카카오톡으로 공유하기</button>
}
