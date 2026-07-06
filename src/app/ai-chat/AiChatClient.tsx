'use client'

import { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/Button'
import { SendIcon, SparklesIcon, FileTextIcon, UploadIcon, XIcon, Loader2Icon } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

export function AiChatClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfBase64, setPdfBase64] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    onDrop: (accepted) => {
      const file = accepted[0]
      if (!file) return
      setPdfFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setPdfBase64(result.split(',')[1])
      }
      reader.readAsDataURL(file)
    },
  })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const removePdf = () => {
    setPdfFile(null)
    setPdfBase64(null)
  }

  const sendMessage = async () => {
    const prompt = input.trim()
    if (!prompt || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: prompt }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          pdfBase64,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')

      setMessages((prev) => [...prev, { role: 'assistant', text: data.text }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: err instanceof Error ? err.message : 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="text-center mb-6">
        <SparklesIcon className="h-10 w-10 text-purple-500 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">AI Chat with PDF</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Powered by Google Gemini. Ask questions about your PDF documents.</p>
      </div>

      {!pdfFile && (
        <div {...getRootProps()} className="border-2 border-dashed rounded-xl p-8 mb-4 text-center cursor-pointer transition-colors hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/20">
          <input {...getInputProps()} />
          <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">{isDragActive ? 'Drop PDF here' : 'Upload a PDF to chat about it (optional)'}</p>
        </div>
      )}

      {pdfFile && (
        <div className="flex items-center gap-3 p-3 mb-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
          <FileTextIcon className="h-5 w-5 text-purple-600 shrink-0" />
          <span className="text-sm truncate flex-1">{pdfFile.name}</span>
          <button onClick={removePdf} className="p-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <SparklesIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Ask a question about your PDF, or just start a conversation.</p>
            <p className="text-xs mt-1">Example: &quot;Summarize this document&quot; or &quot;What are the key points?&quot;</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 border dark:border-gray-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl px-4 py-2.5">
              <Loader2Icon className="h-5 w-5 animate-spin text-purple-600" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={pdfFile ? 'Ask about your PDF...' : 'Ask anything...'}
          className="flex-1 rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button onClick={sendMessage} disabled={!input.trim() || loading} className="rounded-xl px-4">
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
