import './globals.css'
import { Inter } from 'next/font/google'
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI-Powered Exam Generator',
  description: 'Generate exams and grade theses with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <NeuralNetworkBackground />
        <div className="relative min-h-screen">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}

