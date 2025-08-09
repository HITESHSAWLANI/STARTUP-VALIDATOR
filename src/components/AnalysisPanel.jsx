import { useEffect, useState } from 'react'
import { analyzeStartupWithGemini } from '../lib/analysis.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

export function AnalysisPanel({ startup }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    let ignore = false
    if (!startup) return
    setLoading(true)
    setError('')
    analyzeStartupWithGemini(startup)
      .then((d) => { if (!ignore) setData(d) })
      .catch((e) => { if (!ignore) setError(e.message || 'Failed to analyze') })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [startup])

  if (!startup) {
    return (
      <div className="text-sm text-slate-500 dark:text-slate-400">Select a sample startup to analyze.</div>
    )
  }

  if (loading) {
    return <div className="animate-pulse text-sm">Analyzing {startup.name}…</div>
  }

  if (error) {
    return <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
  }

  if (!data) return null

  const competitorLabels = data.competitionAnalysis.competitors.map((c) => c.name)
  const competitorValues = data.competitionAnalysis.competitors.map((c) => c.marketShare)

  const trendLabels = data.trendData.map((t) => t.label)
  const trendValues = data.trendData.map((t) => t.value)

  const incomeLabels = data.incomeProjection.map((i) => i.label)
  const incomeValues = data.incomeProjection.map((i) => i.revenueUSD)

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-sm font-semibold mb-2">Competition</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-3 bg-white/70 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 shadow-sm">
            <Doughnut
              data={{
                labels: competitorLabels,
                datasets: [{ data: competitorValues, backgroundColor: ['#6366F1','#EC4899','#10B981','#F59E0B','#8B5CF6'] }],
              }}
              options={{ plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
          <div className="rounded-xl p-3 bg-white/70 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 shadow-sm">
            <p className="text-sm whitespace-pre-wrap">{data.competitionAnalysis.summary}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-2">Trends</h3>
        <div className="rounded-xl p-3 bg-white/70 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 shadow-sm">
          <Line
            data={{ labels: trendLabels, datasets: [{ label: 'Momentum', data: trendValues, borderColor: '#6366F1', backgroundColor: 'rgba(99,102,241,0.25)', fill: true, tension: .35 }] }}
            options={{ plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (v) => v } } } }}
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-2">Market Level</h3>
        <div className="rounded-xl p-4 bg-white/70 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div className="text-base font-medium">{data.marketLevel}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Confidence: {(data.confidence*100).toFixed(0)}%</div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-2">Scope & Risks</h3>
        <div className="rounded-xl p-4 bg-white/70 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 shadow-sm">
          <div className="text-sm whitespace-pre-wrap">{data.scopeSummary}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.riskFactors.map((r, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20">{r}</span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-2">Income Projection (USD)</h3>
        <div className="rounded-xl p-3 bg-white/70 dark:bg-slate-900/60 border border-black/10 dark:border-white/10 shadow-sm">
          <Bar
            data={{ labels: incomeLabels, datasets: [{ label: 'Revenue', data: incomeValues, backgroundColor: '#10B981' }] }}
            options={{ plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (v) => `$${v}` } } } }}
          />
        </div>
      </section>
    </div>
  )
}


