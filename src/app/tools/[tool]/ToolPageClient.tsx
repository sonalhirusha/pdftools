'use client'

import { useState, useCallback, type ReactNode } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/Button'
import { FileTextIcon, Upload, Download, X, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Tool } from '@/types'
import { AdTopBanner, AdInContent, AdStickyFooter } from '@/components/ads/AdPlacement'

interface ToolPageClientProps {
  tool: Tool
}

export function ToolPageClient({ tool }: ToolPageClientProps) {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[], rejected: { file: File; errors: { message: string }[] }[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles].slice(0, 10))
    setCompleted(false)
    setError('')
    if (rejected.length > 0) {
      setError(rejected[0].errors[0]?.message || 'File rejected')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxSize: 500 * 1024 * 1024 })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setCompleted(false)
  }

  const handleProcess = async () => {
    if (files.length === 0) return
    setProcessing(true)
    setError('')
    setProgress(0)

    const formData = new FormData()
    files.forEach((f) => formData.append('files', f))

    try {
      const res = await fetch(`/api/tools/${tool.id}`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          throw new Error(data.error || `Server error (${res.status})`)
        } catch {
          throw new Error(text.trim() || `Server error (${res.status})`)
        }
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setCompleted(true)
      setProgress(100)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!downloadUrl) return
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = `${tool.id}-output.pdf`
    a.click()
  }

  const handleReset = () => {
    setFiles([])
    setCompleted(false)
    setDownloadUrl('')
    setError('')
    setProgress(0)
  }

  return (
    <div className="container-page max-w-3xl">
      <AdTopBanner />
      <div className="text-center mb-8">
        <h1 className="section-title">{tool.name}</h1>
        <p className="section-subtitle mx-auto">{tool.description}</p>
      </div>

      <div className="card">
        {/* Upload Area */}
        {!completed && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-950' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="font-medium text-sm">{isDragActive ? 'Drop files here' : 'Drag & drop files here'}</p>
            <p className="text-xs text-gray-500 mt-1">or click to browse (max 500MB)</p>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && !completed && (
          <div className="mt-4 space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <FileTextIcon className="h-4 w-4 text-primary-600" />
                <span className="text-sm flex-1 truncate">{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                <button onClick={() => removeFile(i)} className="btn-ghost p-1"><X className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        )}

        {/* Progress */}
        {processing && (
          <div className="mt-4 space-y-2">
            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-500 text-center">Processing...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950 p-3 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <AdInContent />

        {/* Actions */}
        <div className="mt-6 flex gap-3 justify-center">
          {!completed && files.length > 0 && (
            <Button onClick={handleProcess} loading={processing} size="lg">
              {processing ? 'Processing...' : `Process ${files.length} file${files.length > 1 ? 's' : ''}`}
            </Button>
          )}
          {completed && (
            <>
              <Button onClick={handleDownload} size="lg"><Download className="h-4 w-4" /> Download</Button>
              <Button variant="secondary" onClick={handleReset}>Process another</Button>
            </>
          )}
        </div>

        {/* Success */}
        {completed && (
          <div className="mt-4 flex items-center gap-2 justify-center text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            File processed successfully!
          </div>
        )}
      </div>
      <AdStickyFooter />
    </div>
  )
}
