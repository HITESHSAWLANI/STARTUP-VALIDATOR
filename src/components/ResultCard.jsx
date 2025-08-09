export function ResultCard({ title, children }) {
  return (
    <div className="rounded-2xl p-4 bg-white/70 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 shadow-md animate-[fadeIn_.4s_ease-out]">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div className="text-sm">{children}</div>
    </div>
  )
}


