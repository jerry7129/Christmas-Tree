import React from 'react'
import {useNavigate} from 'react-router-dom'

export default function Information() {
  const navigate = useNavigate()

  const projectDetails = {
    name: '크리스마스 트리 꾸미기',
    description:
      '"내 트리를 꾸며줘!"의 영감을 받아서 만든 사용자 가상 크리스마스 트리를 꾸미고, 다른 사람들이 그 트리에 메시지를 남길 수 있는 개인 프로젝트입니다.'
  }

  const frontendDetails = {
    기술: 'React (라이브러리), TypeScript',
    호스팅: 'AWS S3',
    CDN_및_HTTPS: 'AWS CloudFront',
    도메인_연결: 'AWS Route 53',
    SSL_인증서: 'AWS Certificate Manager',
    도메인: 'https://www.mychristmastreeletter.com'
  }

  const backendDetails = {
    기술: 'Node.js (런타임), Express (프레임워크), TypeScript',
    데이터베이스: 'MongoDB',
    호스팅: 'AWS EC2',
    도메인_연결: 'AWS Route 53',
    SSL_인증서: 'AWS Certificate Manager',
    도메인: '비공개'
  }

  const developerInfo = {
    이름: '김승관',
    이메일: 'jerry7129@naver.com',
    깃허브: 'https://github.com/jerry7129',
    인스타그램: '@winthecrown'
  }

  const containerStyle = {
    maxWidth: '700px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    color: '#333'
  }

  const titleStyle = {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#0078ff'
  }

  const sectionTitleStyle = {
    fontSize: '1.2rem',
    marginTop: '15px',
    marginBottom: '8px',
    borderBottom: '1px solid #0078ff',
    paddingBottom: '5px'
  }

  const listItemStyle = {
    fontSize: '1rem',
    marginBottom: '5px'
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>프로젝트 개요</h1>
      <h3 style={sectionTitleStyle}>프로젝트 이름</h3>
      <p style={listItemStyle}>{projectDetails.name}</p>
      <h3 style={sectionTitleStyle}>설명</h3>
      <p style={listItemStyle}>{projectDetails.description}</p>

      <h1 style={titleStyle}>개발 환경 및 기술 스택</h1>

      <h3 style={sectionTitleStyle}>프론트엔드</h3>
      {Object.entries(frontendDetails).map(([key, value]) => (
        <p key={key} style={listItemStyle}>
          <strong>{key}:</strong> {value}
        </p>
      ))}

      <h3 style={sectionTitleStyle}>백엔드</h3>
      {Object.entries(backendDetails).map(([key, value]) => (
        <p key={key} style={listItemStyle}>
          <strong>{key}:</strong> {value}
        </p>
      ))}

      <h1 style={titleStyle}>개발자</h1>
      {Object.entries(developerInfo).map(([key, value]) => (
        <p key={key} style={listItemStyle}>
          <strong>{key}:</strong>{' '}
          {key === '깃허브' ? (
            <a href={value} target="_blank" rel="noopener noreferrer">
              {value}
            </a>
          ) : (
            value
          )}
        </p>
      ))}
      <button onClick={() => navigate('/')}>로그인 홈으로 가기</button>
    </div>
  )
}
