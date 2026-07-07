import { NextRequest, NextResponse } from 'next/server'
import { chatWithPDF, chatOnly, type ChatMessage } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      prompt: string
      pdfBase64?: string | null
      history?: ChatMessage[]
    }

    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 503 })
    }

    let text: string
    if (body.pdfBase64) {
      text = await chatWithPDF(body.prompt, body.pdfBase64, body.history || [])
    } else {
      text = await chatOnly(body.prompt, body.history || [])
    }

    return NextResponse.json({ text })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI chat error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
