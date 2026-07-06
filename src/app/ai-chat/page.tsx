import { Metadata } from 'next'
import { AiChatClient } from './AiChatClient'

export const metadata: Metadata = {
  title: 'AI Chat with PDF - PDFTools',
  description: 'Chat with your PDF files using Google Gemini AI. Ask questions, get summaries, and extract insights.',
}

export default function AiChatPage() {
  return (
    <div className="container-page max-w-4xl">
      <AiChatClient />
    </div>
  )
}
