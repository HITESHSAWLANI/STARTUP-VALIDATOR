import { GEMINI_API_KEY } from '../config.js'

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

function buildPrompt(name, description, targetMarket) {
  return `You are a startup market analyst. Analyze the idea for the SPECIFIED TARGET MARKET and return STRICT JSON only.

Startup Name: ${name}
Idea Description: ${description}
Target Market (geography/segment): ${targetMarket}

Return JSON with this exact schema and realistic values for the TARGET MARKET ONLY:
{
  "marketAnalysis": string,               // concise paragraph focused on ${targetMarket}
  "tenYearSummary": string,               // narrative summary of last 10 completed years
  "risks": string[],                      // 3-6 bullet risks
  "growthPotential": number,              // 0..100 score; consider historical trajectory
  "marketData": [                         // yearly figures (approximate), last 10 completed years ONLY
    { "year": number, "sales": number, "turnover": number, "profit": number }
  ],
  "overallBusinessYearwise": [            // last 10 completed years ONLY
    { "year": number, "marketSizeUSD": number, "avgCustomerSpendUSD": number }
  ],
  "overallProfitYearwise": [              // last 10 completed years ONLY
    { "year": number, "profit": number }
  ],
  "competitors": [                        // key competitors in ${targetMarket}
    { "name": string, "summary": string, "averageMarketShare": number, "yearwise": [{ "year": number, "marketShare": number }] }
  ],
  "sources": string[]                     // 2-5 source URLs used
}

Rules:
- Use ONLY the last 10 completed calendar years (exclude the current year).
- Provide market-specific values; if estimating, use best public data and mark approximate values with a ~ prefix.
- Respond with ONLY JSON. No markdown, no extra text.`
}

function tryParseJson(text) {
  try { return JSON.parse(text) } catch (_) {}
  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    try { return JSON.parse(match[0]) } catch (_) {}
  }
  throw new Error('Model returned non-JSON output')
}

export async function analyzeIdeaWithGemini({ name, description, targetMarket }) {
  if (!GEMINI_API_KEY) throw new Error('Missing API key')
  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: buildPrompt(name, description, targetMarket || 'Global') }],
      },
    ],
  }
  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Gemini error: ${res.status} ${text}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n') || ''
  const parsed = tryParseJson(text)

  // Shape + fallbacks
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 10
  const years = Array.from({ length: 10 }, (_, i) => startYear + i)
  const defaultMarketData = years.map((y, i) => ({
    year: y,
    sales: 500 + i * 120,
    turnover: 1000 + i * 300,
    profit: 200 + i * 80,
  }))
  const defaultOverallBusiness = years.map((y, i) => ({
    year: y,
    marketSizeUSD: 5_000_000 + i * 500_000,
    avgCustomerSpendUSD: 200 + i * 15,
  }))
  const defaultOverallProfit = defaultMarketData.map(d => ({ year: d.year, profit: d.profit }))
  const defaultCompetitors = [
    { name: 'Incumbent A', summary: 'Established leader with broad distribution.', averageMarketShare: 32, yearwise: years.map((y, i) => ({ year: y, marketShare: Math.max(22, 35 - i) })) },
    { name: 'Challenger B', summary: 'Fast-growing niche specialist.', averageMarketShare: 18, yearwise: years.map((y, i) => ({ year: y, marketShare: Math.min(28, 10 + i) })) },
  ]

  return {
    marketAnalysis: parsed.marketAnalysis || 'Market analysis not available.',
    tenYearSummary: parsed.tenYearSummary || 'Ten-year historical summary not available.',
    risks: Array.isArray(parsed.risks) && parsed.risks.length ? parsed.risks.slice(0, 6) : ['Execution risk', 'Market adoption risk', 'Competitive pressure'],
    growthPotential: typeof parsed.growthPotential === 'number' ? Math.max(0, Math.min(100, parsed.growthPotential)) : 65,
    marketData: Array.isArray(parsed.marketData) && parsed.marketData.length ? parsed.marketData : defaultMarketData,
    overallBusinessYearwise: Array.isArray(parsed.overallBusinessYearwise) && parsed.overallBusinessYearwise.length ? parsed.overallBusinessYearwise : defaultOverallBusiness,
    overallProfitYearwise: Array.isArray(parsed.overallProfitYearwise) && parsed.overallProfitYearwise.length ? parsed.overallProfitYearwise : defaultOverallProfit,
    competitors: Array.isArray(parsed.competitors) && parsed.competitors.length ? parsed.competitors : defaultCompetitors,
    sources: Array.isArray(parsed.sources) ? parsed.sources.slice(0,5) : [],
  }
}


