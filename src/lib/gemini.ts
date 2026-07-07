import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite']
const API_VERSIONS = ['v1beta', 'v1']

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

async function tryModels(prompt: string, pdfBase64: string | null, history: ChatMessage[]): Promise<string> {
  for (const version of API_VERSIONS) {
    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: version })
        const chat = model.startChat({
          history: history.map((h) => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.text }],
          })),
        })
        const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = []
        if (pdfBase64) {
          parts.push({ inlineData: { mimeType: 'application/pdf', data: pdfBase64 } })
        }
        parts.push({ text: prompt })
        const result = await chat.sendMessage(parts)
        return result.response.text()
      } catch {
        continue
      }
    }
  }
  throw new Error('All Gemini models and API versions failed. Check your API key.')
}

export async function chatWithPDF(
  prompt: string,
  pdfBase64: string | null,
  history: ChatMessage[] = []
): Promise<string> {
  return tryModels(prompt, pdfBase64, history)
}

export async function chatOnly(
  prompt: string,
  history: ChatMessage[] = []
): Promise<string> {
  return tryModels(prompt, null, history)
}
