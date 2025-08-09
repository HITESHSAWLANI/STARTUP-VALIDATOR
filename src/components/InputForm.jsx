import { useState } from 'react'

export function InputForm({ onSubmit, loading }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [targetMarket, setTargetMarket] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !description.trim() || !targetMarket.trim() || loading) return
    onSubmit({ name: name.trim(), description: description.trim(), targetMarket: targetMarket.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Startup Name"
          className="rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400/60 shadow-sm"
        />
        <input
          type="text"
          value={targetMarket}
          onChange={(e) => setTargetMarket(e.target.value)}
          placeholder="Target Market (e.g., US SMBs, India Tier-2)"
          className="rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400/60 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="sm:hidden inline-flex justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 text-white px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition disabled:opacity-50"
        >
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your startup idea…"
        rows={3}
        className="w-full resize-y rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur px-4 py-2 text-sm placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 shadow-sm"
      />
      <div className="hidden sm:flex">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 text-white px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition disabled:opacity-50"
        >
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>
    </form>
  )
}


