import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'cost-tracker',
  description: 'cost-trcker',
  generator: 'cost-tracker',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
