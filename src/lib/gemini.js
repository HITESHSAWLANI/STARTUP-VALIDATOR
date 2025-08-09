import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
if (!API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('VITE_GEMINI_API_KEY is not set. Add it to a .env file at the project root.')
}

const genAI = new GoogleGenerativeAI(API_KEY || '')
const model = () => genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function generateGeminiResponse(history) {
  // history is an array of { role: 'user' | 'model', content: string }
  try {
    const parts = history.map((m) => ({ role: m.role, parts: [{ text: m.content }] }))
    const response = await model().generateContent({ contents: parts })
    const text = response.response?.text?.() || response.response?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!text) throw new Error('Empty response')
    return text
  } catch (err) {
    throw new Error(err.message || 'Failed to fetch from Gemini API')
  }
}


