import { useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage.jsx'

export function ChatWindow({ messages }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1">
      {messages.length === 0 && (
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-10">
          Ask anything to get started.
        </div>
      )}
      {messages.map((m, idx) => (
        <ChatMessage key={idx} role={m.role} content={m.content} isLoading={m.isLoading} />
      ))}
      <div ref={endRef} />
    </div>
  )
}


