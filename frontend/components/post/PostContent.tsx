'use client'

interface PostContentProps {
  content: string
}

/**
 * 게시글 본문 렌더링
 * - 일반 텍스트: HTML 이스케이프 + URL 링크화
 * - [BAAL_IMG:url]: 이미지 표시
 * - [BAAL_ASCII]...[/BAAL_ASCII]: 골드 모노스페이스 아스키 아트
 */
export default function PostContent({ content }: PostContentProps) {
  const parts = parseContent(content)

  return (
    <div className="text-baal-text leading-relaxed">
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return (
            <div
              key={i}
              className="whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: escapeAndLinkify(part.value) }}
            />
          )
        }
        if (part.type === 'image') {
          return (
            <div key={i} className="my-3">
              <img
                src={part.value}
                alt="첨부 이미지"
                className="max-w-full max-h-[500px] rounded-lg border border-baal-border-light object-contain"
                loading="lazy"
              />
            </div>
          )
        }
        if (part.type === 'ascii') {
          return (
            <div key={i} className="my-3 overflow-x-auto">
              <pre
                className="inline-block px-4 py-3 bg-neutral-900 rounded-lg text-[10px] sm:text-xs leading-[1.15] font-mono"
                style={{ color: '#d4af37' }}
              >
                {part.value}
              </pre>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

interface ContentPart {
  type: 'text' | 'image' | 'ascii'
  value: string
}

function parseContent(content: string): ContentPart[] {
  const parts: ContentPart[] = []
  let remaining = content

  // Pattern: [BAAL_ASCII]\n...\n[/BAAL_ASCII] or [BAAL_IMG:url]
  const regex = /\[BAAL_ASCII\]\n?([\s\S]*?)\[\/BAAL_ASCII\]|\[BAAL_IMG:(https?:\/\/[^\]]+)\]/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(remaining)) !== null) {
    // Text before this match
    if (match.index > lastIndex) {
      const text = remaining.slice(lastIndex, match.index).trim()
      if (text) parts.push({ type: 'text', value: text })
    }

    if (match[1] !== undefined) {
      // ASCII art
      parts.push({ type: 'ascii', value: match[1].trimEnd() })
    } else if (match[2]) {
      // Image
      parts.push({ type: 'image', value: match[2] })
    }

    lastIndex = regex.lastIndex
  }

  // Remaining text
  if (lastIndex < remaining.length) {
    const text = remaining.slice(lastIndex).trim()
    if (text) parts.push({ type: 'text', value: text })
  }

  // If no markers found, return original content
  if (parts.length === 0) {
    parts.push({ type: 'text', value: content })
  }

  return parts
}

function escapeAndLinkify(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline break-all">$1</a>'
    )
}
