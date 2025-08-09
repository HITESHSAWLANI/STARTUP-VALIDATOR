import { useEffect, useState } from 'react'
import './App.css'
import { ThemeToggle } from './components/ThemeToggle.jsx'
import { StartupSelector } from './components/StartupSelector.jsx'
import { InputForm } from './components/InputForm.jsx'
import { ResultCard } from './components/ResultCard.jsx'
import { TrendingCarousel } from './components/TrendingCarousel.jsx'
import { analyzeIdeaWithGemini } from './lib/analyzeFetch.js'

function App() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const [selectedStartup, setSelectedStartup] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [ideaResults, setIdeaResults] = useState(null)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-900/60">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 text-white font-bold shadow-md">G</span>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Startup Validator</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <section className="rounded-2xl p-4 sm:p-6 bg-white/70 dark:bg-slate-800/60 shadow-xl border border-black/5 dark:border-white/10 backdrop-blur-md mb-6">
            <h2 className="text-base font-semibold mb-3">Trending Startups</h2>
            <TrendingCarousel />
          </section>

          <section className="rounded-2xl p-4 sm:p-6 bg-white/70 dark:bg-slate-800/60 shadow-xl border border-black/5 dark:border-white/10 backdrop-blur-md mb-6">
            <h2 className="text-base font-semibold mb-3">Sample Startups</h2>
            <StartupSelector onSelect={async (s) => {
              // Fill form with sample data and auto-run analysis against its region as target market
              setFormError('')
              setFormLoading(true)
              setIdeaResults(null)
              try {
                const res = await analyzeIdeaWithGemini({ name: s.name, description: s.description, targetMarket: s.region })
                setIdeaResults(res)
              } catch (e) {
                setFormError(e.message || 'Failed to analyze sample')
              } finally {
                setFormLoading(false)
              }
            }} />
          </section>

          <section className="rounded-2xl p-4 sm:p-6 bg-white/70 dark:bg-slate-800/60 shadow-xl border border-black/5 dark:border-white/10 backdrop-blur-md mb-6">
            <h2 className="text-base font-semibold mb-3">Validate Your Idea</h2>
            <InputForm
              loading={formLoading}
              onSubmit={async ({ name, description, targetMarket }) => {
                setFormError('')
                setFormLoading(true)
                setIdeaResults(null)
                try {
                  const res = await analyzeIdeaWithGemini({ name, description, targetMarket })
                  setIdeaResults(res)
                } catch (e) {
                  setFormError(e.message || 'Failed to analyze idea')
                } finally {
                  setFormLoading(false)
                }
              }}
            />
            {formError && <div className="mt-3 text-sm text-red-600 dark:text-red-400">{formError}</div>}
            {ideaResults && (
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <ResultCard title="Market Analysis">{ideaResults.marketAnalysis}</ResultCard>
                <ResultCard title="10-year Summary">{ideaResults.tenYearSummary}</ResultCard>
                <ResultCard title="Risks">
                  <ul className="list-disc pl-5 space-y-1">
                    {ideaResults.risks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </ResultCard>
                <ResultCard title="Growth Potential">
                  <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${ideaResults.growthPotential}%` }} />
                  </div>
                  <div className="mt-2 text-sm">{ideaResults.growthPotential}% over 5 years</div>
                </ResultCard>
                <ResultCard title="Competitors (Market Share)">
                  <div className="space-y-2">
                    {ideaResults.competitors?.map((c, i) => (
                      <div key={i} className="rounded-xl p-3 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10">
                        <div className="text-sm font-semibold">{c.name} — ~{c.averageMarketShare}%</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{c.summary}</div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr>
                                {c.yearwise?.map((y, j) => <th key={j} className="font-medium pr-2 py-1 text-right">{y.year}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {c.yearwise?.map((y, j) => <td key={j} className="pr-2 py-1 text-right">{y.marketShare}%</td>)}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </ResultCard>
                {ideaResults.sources?.length > 0 && (
                  <ResultCard title="Sources">
                    <ul className="list-disc pl-5 space-y-1">
                      {ideaResults.sources.map((s, i) => (
                        <li key={i}><a href={s} target="_blank" rel="noreferrer" className="underline decoration-dotted">{s}</a></li>
                      ))}
                    </ul>
                  </ResultCard>
                )}
              </div>
            )}
          </section>
      </div>
      </main>

      {/* footer removed per request */}
      </div>
  )
}

export default App
