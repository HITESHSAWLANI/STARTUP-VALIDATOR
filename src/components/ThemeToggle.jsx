import { IoMoon, IoSunny } from 'react-icons/io5'

export function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === 'dark'
  const toggle = () => setTheme(isDark ? 'light' : 'dark')
  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-black/10 dark:border-white/10 shadow-sm transition"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <IoSunny /> : <IoMoon />}
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}


