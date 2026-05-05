"use client"

interface HtmlContentProps {
  content: string
  className?: string
}

export default function HtmlContent({ content, className = "" }: HtmlContentProps) {
  return (
    <div
      className={`prose prose-sm max-w-none text-gray-500 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}