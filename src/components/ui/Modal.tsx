'use client'
import { useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface ModalProps { open: boolean; onClose: () => void; title?: string; children: ReactNode; className?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }
const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' }

export function Modal({ open, onClose, title, children, className, size = 'md' }: ModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }, [onClose])
  useEffect(() => {
    if (open) { document.addEventListener('keydown', handleKeyDown); document.body.style.overflow = 'hidden' }
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = '' }
  }, [open, handleKeyDown])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className={cn('relative w-full rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900 animate-in fade-in zoom-in-95', sizeClasses[size], className)}>
        {title && <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><button onClick={onClose} className="btn-ghost p-1" aria-label="Close"><X className="h-5 w-5" /></button></div>}
        {children}
      </div>
    </div>
  )
}
