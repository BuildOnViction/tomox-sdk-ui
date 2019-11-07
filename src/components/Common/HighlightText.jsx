import React from 'react'
import type { Node } from 'react'

const escapeRegExpChars = (text: string) => {
  return text.replace(/([.*+?^=!:${}()|[]\/\\])/g, '\\$1')
}

type Props = {
  /** The text to display */
  text: string,
  /** The text to search */
  query: string,
};

const HighlightText = ({ text, query }: Props) => {
  let lastIndex = 0
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars)
  if (words.length === 0) {
    return [text]
  }
  const regexp = new RegExp(words.join('|'), 'gi')
  const tokens: Array<Node> = []
  while (true) {
    const match = regexp.exec(text)
    if (!match) {
      break
    }
    const length = match[0].length
    const before = text.slice(lastIndex, regexp.lastIndex - length)
    if (before.length > 0) {
      tokens.push(before)
    }
    lastIndex = regexp.lastIndex
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>)
  }
  const rest = text.slice(lastIndex)
  if (rest.length > 0) {
    tokens.push(rest)
  }
  return tokens
}

export default HighlightText
