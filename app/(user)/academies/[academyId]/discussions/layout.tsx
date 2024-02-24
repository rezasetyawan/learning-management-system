import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Learningspace',
  description: 'Learning management system website made by Reza Setyawan',
}

export default function DiscussionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <main>{children}</main>
      </body>
    </html>
  )
}
