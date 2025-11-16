"use client"

import { useMemo } from "react"

interface GitHubAvatarProps {
  username?: string
  size?: number
}

const getAvatarColorForUser = (username: string): string => {
  if (!username || typeof username !== "string") {
    return "#4ECDC4"
  }
  
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52C7B8",
    "#FF8C42", "#A8E6CF", "#FFD93D", "#6BCB77", "#4D96FF",
    "#FF6348", "#20C997", "#FFB627", "#FF6584", "#9B59B6",
  ]
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function GitHubAvatar({ username = "", size = 80 }: GitHubAvatarProps) {
  const { blockColor, blocks } = useMemo(() => {
    const validUsername = username || "guest"
    const selectedColor = getAvatarColorForUser(validUsername)

    // Use username as seed for consistent block generation
    let seed = 0
    for (let i = 0; i < validUsername.length; i++) {
      seed += validUsername.charCodeAt(i)
    }
    
    const numBlocks = 3 + (seed % 5)
    const blockPositions = new Set<number>()
    
    let position = seed % 9
    while (blockPositions.size < numBlocks) {
      blockPositions.add(position)
      position = (position + 2) % 9
    }

    const blockArray = Array.from({ length: 9 }, (_, i) => {
      if (blockPositions.has(i)) {
        return selectedColor
      }
      return null
    })

    return { blockColor: selectedColor, blocks: blockArray }
  }, [username])

  const blockSize = size / 3

  return (
    <div
      className="rounded-lg overflow-hidden border-2 border-border"
      style={{
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
      }}
    >
      {blocks.map((color, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: color || "transparent",
            width: blockSize,
            height: blockSize,
          }}
        />
      ))}
    </div>
  )
}

export { getAvatarColorForUser }
