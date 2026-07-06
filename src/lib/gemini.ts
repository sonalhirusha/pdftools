import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

let model: GenerativeModel | null = null

function getModel(): GenerativeModel {
  if (!model) {
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  }
  return model
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

export async function chatWithPDF(
  prompt: string,
  pdfBase64: string | null,
  history: ChatMessage[] = []
): Promise<string> {
  const m = getModel()
  const chat = m.startChat({
    history: history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }],
    })),
  })

  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = []
  if (pdfBase64) {
    parts.push({
      inlineData: { mimeType: 'application/pdf', data: pdfBase64 },
    })
  }
  parts.push({ text: prompt })

  const result = await chat.sendMessage(parts)
  return result.response.text()
}

export async function chatOnly(
  prompt: string,
  history: ChatMessage[] = []
): Promise<string> {
  const m = getModel()
  const chat = m.startChat({
    history: history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }],
    })),
  })
  const result = await chat.sendMessage(prompt)
  return result.response.text()
}
