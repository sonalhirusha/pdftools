'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { SearchIcon, X } from 'lucide-react'
import { searchTools } from '@/lib/tools'

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ name: string; href: string; category: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])
  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    setResults(searchTools(query).map(t => ({ name: t.name, href: t.href, category: t.category })))
  }, [query])
  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(true) } }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <button onClick={() => setOpen(true)} className="btn-ghost p-2 hidden sm:flex items-center gap-2 text-sm text-gray-400" aria-label="Search">
        <SearchIcon className="h-4 w-4" /><span className="hidden lg:inline">Search...</span>
        <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-gray-50 px-1.5 text-xs text-gray-400 dark:bg-gray-800 dark:border-gray-700">Ctrl+K</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg rounded-xl border bg-white shadow-2xl dark:bg-gray-900 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center border-b px-4 dark:border-gray-700">
              <SearchIcon className="h-4 w-4 text-gray-400 mr-3" />
              <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools..." className="flex-1 py-4 bg-transparent border-0 outline-none text-sm" />
              <button onClick={() => setOpen(false)} className="btn-ghost p-1"><X className="h-4 w-4" /></button>
            </div>
            {results.length > 0 && (
              <div className="max-h-72 overflow-y-auto p-2">
                {results.map(r => (
                  <Link key={r.href} href={r.href} onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="text-sm font-medium">{r.name}</span>
                    <span className="text-xs text-gray-400 capitalize ml-auto">{r.category}</span>
                  </Link>
                ))}
              </div>
            )}
            {query.length >= 2 && results.length === 0 && <p className="p-4 text-sm text-gray-500 text-center">No tools found</p>}
          </div>
        </div>
      )}
    </div>
  )
}
