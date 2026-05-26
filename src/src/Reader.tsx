import { useState, useRef, useEffect, useCallback } from 'react'
import './Reader.css'
import bookData from './assets/book.json'

interface BookPage {
  FileName: string
  Page: number
  Content: string
}

const pages: BookPage[] = (bookData as BookPage[]).sort((a, b) => a.Page - b.Page)

export default function Reader({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0)
  }, [index])

  const goToPage = useCallback((newIndex: number) => {
    setVisible(false)
    setTimeout(() => {
      setIndex(newIndex)
      setVisible(true)
    }, 200)
  }, [])

  const currentPage = pages[index]
  const showPageNumber = currentPage.Page >= 1

  return (
    <div className="reader">
      <button className="reader-close" onClick={onClose} aria-label="Close">
        &times;
      </button>

      <div className="reader-body">
        <button
          className="reader-nav reader-nav-left"
          onClick={() => goToPage(Math.max(0, index - 1))}
          disabled={index === 0 || !visible}
          aria-label="Previous page"
        >
          &#8249;
        </button>

        <div className="reader-content">
          <div className={`reader-text ${visible ? 'reader-text-visible' : 'reader-text-hidden'}`} ref={contentRef} dangerouslySetInnerHTML={{ __html: formatContent(currentPage.Content) }} />
        </div>

        <button
          className="reader-nav reader-nav-right"
          onClick={() => goToPage(Math.min(pages.length - 1, index + 1))}
          disabled={index === pages.length - 1 || !visible}
          aria-label="Next page"
        >
          &#8250;
        </button>
      </div>

      {showPageNumber && (
        <p className="reader-page-number">{currentPage.Page} / {pages[pages.length - 1].Page}</p>
      )}
    </div>
  )
}

function formatContent(content: string): string {
  let html = content
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />')

  // List items
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')

  // Line breaks (two trailing spaces or explicit \n within paragraphs)
  html = html.replace(/  \n/g, '<br />')

  // Paragraphs: split on double newlines
  html = html
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim()
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<hr') ||
        trimmed.startsWith('<li')
      ) {
        if (trimmed.startsWith('<li')) {
          return `<ul>${trimmed}</ul>`
        }
        return trimmed
      }
      return `<p>${trimmed}</p>`
    })
    .join('')

  // Clean up remaining single newlines within paragraphs as line breaks
  html = html.replace(/<p>([\s\S]*?)<\/p>/g, (_match, inner) => {
    return `<p>${inner.replace(/\n/g, '<br />')}</p>`
  })

  return html
}
