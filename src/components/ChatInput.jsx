import { useEffect, useRef, useState } from 'react'
import { generateGeminiResponse } from '../lib/gemini.js'
import { IoSend } from 'react-icons/io5'

export function ChatInput({ messages, setMessages }) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage = { role: 'user', content: trimmed }
    const loadingMessage = { role: 'model', content: 'Thinking…', isLoading: true }
    setMessages((prev) => [...prev, userMessage, loadingMessage])
    setInput('')
    setIsLoading(true)

    try {
      const reply = await generateGeminiResponse([...messages, userMessage])
      setMessages((prev) => {
        const next = [...prev]
        const idx = next.findIndex((m) => m.isLoading)
        if (idx !== -1) next[idx] = { role: 'model', content: reply }
        return next
      })
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev]
        const idx = next.findIndex((m) => m.isLoading)
        if (idx !== -1) next[idx] = { role: 'model', content: `Error: ${err.message || 'Failed to fetch response.'}` }
        return next
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex items-end gap-2">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your question..."
        rows={1}
        onInput={(e) => {
          e.currentTarget.style.height = 'auto'
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
        }}
        className="flex-1 resize-none rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur px-4 py-2 text-sm placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 shadow-sm"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 text-white px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition disabled:opacity-50"
        title="Send"
      >
        <IoSend />
        Send
      </button>
    </form>
  )
}


