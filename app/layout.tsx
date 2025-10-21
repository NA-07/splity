import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Splity - Expense Sharing Made Easy',
  description: 'Split expenses with friends and groups effortlessly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
