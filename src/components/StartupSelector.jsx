const samples = [
  {
    id: 's1',
    name: 'EcoCharge',
    sector: 'Clean Energy',
    targetMarket: 'Urban EV owners',
    region: 'United States',
    description: 'On-demand EV charging vans that charge parked vehicles while owners are at work.'
  },
  {
    id: 's2',
    name: 'HealthLens AI',
    sector: 'Healthcare AI',
    targetMarket: 'Mid-size clinics',
    region: 'United Kingdom',
    description: 'Clinical note summarization and coding automation to reduce admin time for doctors.'
  },
  {
    id: 's3',
    name: 'FarmTrack',
    sector: 'AgriTech',
    targetMarket: 'Smallholder farmers',
    region: 'India',
    description: 'IoT + satellite data to optimize irrigation schedules and predict yields.'
  }
]

export function StartupSelector({ onSelect }) {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {samples.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s)}
          className="group text-left rounded-xl p-4 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/15 transition shadow-sm hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.sector} • {s.region}</div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition text-xs px-2 py-0.5 rounded-full bg-indigo-500/90 text-white">Select</div>
          </div>
          <div className="mt-2 text-sm text-slate-700 dark:text-slate-200 line-clamp-3">{s.description}</div>
        </button>
      ))}
    </div>
  )
}


