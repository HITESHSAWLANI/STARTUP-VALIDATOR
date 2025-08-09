import { useEffect, useRef } from 'react'

const trending = [
  { id: 't1', name: 'NovaAI', tagline: 'AI copilots for sales teams', logo: 'https://dummyimage.com/48x48/6366f1/ffffff&text=N' },
  { id: 't2', name: 'GreenCart', tagline: 'Sustainable grocery delivery', logo: 'https://dummyimage.com/48x48/10b981/ffffff&text=G' },
  { id: 't3', name: 'CloudForge', tagline: 'DevOps automation suite', logo: 'https://dummyimage.com/48x48/f59e0b/ffffff&text=C' },
  { id: 't4', name: 'MediSync', tagline: 'Connected health records', logo: 'https://dummyimage.com/48x48/ec4899/ffffff&text=M' },
  { id: 't5', name: 'AgriSense', tagline: 'Smart farming sensors', logo: 'https://dummyimage.com/48x48/8b5cf6/ffffff&text=A' },
]

export function TrendingCarousel() {
  const trackRef = useRef(null)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let raf
    let offset = 0
    const speed = 0.5
    const step = () => {
      offset -= speed
      if (Math.abs(offset) > el.scrollWidth / 2) offset = 0
      el.style.transform = `translateX(${offset}px)`
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  // duplicate list for seamless loop
  const items = [...trending, ...trending]

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur">
      <div ref={trackRef} className="flex gap-4 items-center py-3 will-change-transform">
        {items.map((s, i) => (
          <div key={`${s.id}-${i}`} className="flex items-center gap-3 min-w-[260px] px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition">
            <img src={s.logo} alt="logo" className="h-8 w-8 rounded-lg" />
            <div>
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.tagline}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


