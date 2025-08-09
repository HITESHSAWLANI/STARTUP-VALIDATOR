import clsx from 'classnames'

export function ChatMessage({ role, content, isLoading }) {
  const isUser = role === 'user'
  return (
    <div className={clsx('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-md transition-opacity duration-300',
          'border',
          isUser
            ? 'bg-gradient-to-br from-indigo-500/90 to-pink-500/90 text-white border-white/10'
            : 'bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 border-black/10 dark:border-white/10 backdrop-blur',
        )}
        style={{ opacity: isLoading ? 0.7 : 1 }}
      >
        <div className={clsx('whitespace-pre-wrap', isLoading && 'animate-pulse')}>
          {content}
        </div>
      </div>
    </div>
  )
}


