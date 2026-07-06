import { Tool } from '@/types'

export const tools: Tool[] = [
  // Basic
  { id: 'merge', name: 'Merge PDF', description: 'Combine multiple PDFs into one file', category: 'basic', icon: 'Merge', color: 'from-blue-500 to-blue-600', href: '/tools/merge', popular: true },
  { id: 'split', name: 'Split PDF', description: 'Split a PDF into multiple files', category: 'basic', icon: 'Split', color: 'from-indigo-500 to-indigo-600', href: '/tools/split', popular: true },
  { id: 'compress', name: 'Compress PDF', description: 'Reduce PDF file size', category: 'basic', icon: 'Compress', color: 'from-green-500 to-green-600', href: '/tools/compress', popular: true },
  { id: 'rotate', name: 'Rotate PDF', description: 'Rotate PDF pages', category: 'basic', icon: 'RotateCw', color: 'from-yellow-500 to-yellow-600', href: '/tools/rotate' },
  { id: 'delete-pages', name: 'Delete Pages', description: 'Remove unwanted pages from PDF', category: 'basic', icon: 'Trash2', color: 'from-red-500 to-red-600', href: '/tools/delete-pages', popular: true },
  { id: 'rearrange', name: 'Rearrange Pages', description: 'Reorder pages in your PDF', category: 'basic', icon: 'Shuffle', color: 'from-purple-500 to-purple-600', href: '/tools/rearrange' },
  { id: 'extract', name: 'Extract Pages', description: 'Extract specific pages from PDF', category: 'basic', icon: 'FileOutput', color: 'from-pink-500 to-pink-600', href: '/tools/extract' },

  // Convert
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to editable Word document', category: 'convert', icon: 'FileText', color: 'from-blue-600 to-blue-700', href: '/tools/pdf-to-word', popular: true },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word documents to PDF', category: 'convert', icon: 'FileType', color: 'from-sky-500 to-sky-600', href: '/tools/word-to-pdf', popular: true },
  { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Convert PDF tables to Excel spreadsheets', category: 'convert', icon: 'Table', color: 'from-green-600 to-green-700', href: '/tools/pdf-to-excel' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert Excel spreadsheets to PDF', category: 'convert', icon: 'FileSpreadsheet', color: 'from-emerald-500 to-emerald-600', href: '/tools/excel-to-pdf' },
  { id: 'pdf-to-powerpoint', name: 'PDF to PowerPoint', description: 'Convert PDF to PowerPoint presentation', category: 'convert', icon: 'Presentation', color: 'from-orange-500 to-orange-600', href: '/tools/pdf-to-powerpoint' },
  { id: 'powerpoint-to-pdf', name: 'PowerPoint to PDF', description: 'Convert PowerPoint to PDF', category: 'convert', icon: 'FileSlides', color: 'from-amber-500 to-amber-600', href: '/tools/powerpoint-to-pdf' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to JPG images', category: 'convert', icon: 'Image', color: 'from-rose-500 to-rose-600', href: '/tools/pdf-to-jpg', popular: true },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF', category: 'convert', icon: 'FileImage', color: 'from-violet-500 to-violet-600', href: '/tools/jpg-to-pdf', popular: true },
  { id: 'png-to-pdf', name: 'PNG to PDF', description: 'Convert PNG images to PDF', category: 'convert', icon: 'FileImage', color: 'from-fuchsia-500 to-fuchsia-600', href: '/tools/png-to-pdf' },
  { id: 'pdf-to-png', name: 'PDF to PNG', description: 'Convert PDF pages to PNG images', category: 'convert', icon: 'Image', color: 'from-teal-500 to-teal-600', href: '/tools/pdf-to-png' },
  { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Convert HTML pages to PDF', category: 'convert', icon: 'Code', color: 'from-cyan-500 to-cyan-600', href: '/tools/html-to-pdf' },
  { id: 'text-to-pdf', name: 'Text to PDF', description: 'Convert plain text to PDF', category: 'convert', icon: 'FileText', color: 'from-slate-500 to-slate-600', href: '/tools/text-to-pdf' },

  // Edit
  { id: 'add-text', name: 'Add Text', description: 'Add custom text to your PDF', category: 'edit', icon: 'Type', color: 'from-blue-500 to-blue-600', href: '/tools/add-text' },
  { id: 'highlight', name: 'Highlight', description: 'Highlight text in your PDF', category: 'edit', icon: 'Highlighter', color: 'from-yellow-500 to-yellow-600', href: '/tools/highlight' },
  { id: 'draw', name: 'Draw', description: 'Draw on your PDF pages', category: 'edit', icon: 'Pen', color: 'from-orange-500 to-orange-600', href: '/tools/draw' },
  { id: 'insert-image', name: 'Insert Image', description: 'Add images to your PDF', category: 'edit', icon: 'ImagePlus', color: 'from-green-500 to-green-600', href: '/tools/insert-image' },
  { id: 'watermark', name: 'Watermark', description: 'Add watermark to PDF', category: 'edit', icon: 'Droplets', color: 'from-blue-400 to-blue-500', href: '/tools/watermark' },
  { id: 'remove-watermark', name: 'Remove Watermark', description: 'Remove watermarks from PDF', category: 'edit', icon: 'DropletOff', color: 'from-red-400 to-red-500', href: '/tools/remove-watermark' },
  { id: 'number-pages', name: 'Number Pages', description: 'Add page numbers to your PDF', category: 'edit', icon: 'ListOrdered', color: 'from-purple-500 to-purple-600', href: '/tools/number-pages' },
  { id: 'add-signature', name: 'Add Signature', description: 'Sign your PDF documents', category: 'edit', icon: 'PenLine', color: 'from-indigo-500 to-indigo-600', href: '/tools/add-signature' },
  { id: 'fill-forms', name: 'Fill Forms', description: 'Fill interactive PDF forms', category: 'edit', icon: 'FormInput', color: 'from-teal-500 to-teal-600', href: '/tools/fill-forms' },
  { id: 'flatten', name: 'Flatten PDF', description: 'Flatten editable PDF fields', category: 'edit', icon: 'Layers', color: 'from-gray-500 to-gray-600', href: '/tools/flatten' },

  // Security
  { id: 'password-protect', name: 'Password Protect', description: 'Add password protection to PDF', category: 'security', icon: 'Lock', color: 'from-red-500 to-red-600', href: '/tools/password-protect', popular: true },
  { id: 'unlock', name: 'Unlock PDF', description: 'Remove password from PDF', category: 'security', icon: 'Unlock', color: 'from-green-500 to-green-600', href: '/tools/unlock', popular: true },
  { id: 'encrypt', name: 'Encrypt PDF', description: 'Encrypt your PDF file', category: 'security', icon: 'Shield', color: 'from-orange-500 to-orange-600', href: '/tools/encrypt' },
  { id: 'remove-password', name: 'Remove Password', description: 'Remove PDF security', category: 'security', icon: 'Key', color: 'from-blue-500 to-blue-600', href: '/tools/remove-password' },
  { id: 'redact', name: 'Redact Text', description: 'Redact sensitive text from PDF', category: 'security', icon: 'EyeOff', color: 'from-red-600 to-red-700', href: '/tools/redact' },
  { id: 'metadata-cleaner', name: 'Metadata Cleaner', description: 'Clean PDF metadata', category: 'security', icon: 'Eraser', color: 'from-gray-600 to-gray-700', href: '/tools/metadata-cleaner' },

  // AI
  { id: 'ai-chat', name: 'AI Chat', description: 'Chat with your PDF using Google Gemini AI', category: 'basic', icon: 'Sparkles', color: 'from-purple-600 to-pink-500', href: '/ai-chat', popular: true, new: true },
]

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id)
}

export function getToolsByCategory(category: Tool['category']): Tool[] {
  return tools.filter((t) => t.category === category)
}

export function getPopularTools(): Tool[] {
  return tools.filter((t) => t.popular)
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase()
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
  )
}
