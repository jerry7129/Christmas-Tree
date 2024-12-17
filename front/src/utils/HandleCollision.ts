interface Letter {
  sender: string
  content: string
  decorationType: string
  createdAt: string
  isPrivate: boolean
  position: {x: number; y: number} // 오너먼트 위치
}

export default function resolveCollsision(
  inbox: Letter[],
  position: {x: number; y: number}
) {
  // 충돌 체크
  const check = (newPosition: {x: number; y: number}) => {
    // 오너먼트의 크기를 기준으로 충돌 판정
    const ORNAMENT_SIZE = 16 // css에 맞추기
    const BUFFER = 5 // 최소 간격 (버퍼)

    // 다른 오너먼트들과의 충돌 확인
    for (const letter of inbox) {
      const {x, y} = letter.position || {
        x: -(ORNAMENT_SIZE + BUFFER),
        y: -(ORNAMENT_SIZE + BUFFER)
      }

      const distanceX = Math.abs(newPosition.x - x)
      const distanceY = Math.abs(newPosition.y - y)

      if (distanceX < ORNAMENT_SIZE + BUFFER && distanceY < ORNAMENT_SIZE + BUFFER) {
        return true // 충돌이 발생
      }
    }
    return false // 충돌 없음
  }

  // 충돌 해결
  const adjustedPosition = {...position} // 기존 위치 복사
  const STEP = 5 // 한 번에 이동할 거리
  let leftDistance = 0
  let rightDistance = 0

  while (true) {
    // 오른쪽으로 이동 검사
    const rightPosition = {...adjustedPosition, x: position.x + rightDistance}
    if (!check(rightPosition)) {
      adjustedPosition.x = rightPosition.x
      break
    }

    // 왼쪽으로 이동 검사
    const leftPosition = {...adjustedPosition, x: position.x - leftDistance}
    if (!check(leftPosition)) {
      adjustedPosition.x = leftPosition.x
      break
    }

    // 양쪽 거리 증가
    leftDistance += STEP
    rightDistance += STEP

    // 안전 종료 조건
    if (leftDistance > 1000 && rightDistance > 1000) {
      console.error('Unable to resolve collision')
      break
    }
  }

  return adjustedPosition
}
