'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import FileUpload from './FileUpload'
import { Card, CardContent } from "@/components/ui/card"

export default function ExamGenerator() {
  const [files, setFiles] = useState<File[]>([])
  const [duration, setDuration] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedExam, setGeneratedExam] = useState<string | null>(null)

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('duration', duration)

      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate exam')
      }

      const data = await response.json()
      setGeneratedExam(data.exam)
    } catch (error) {
      console.error('Error generating exam:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedExam) return

    const blob = new Blob([generatedExam], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated_exam.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-gray-700 bg-opacity-50">
      <CardContent className="space-y-6 p-6">
        <FileUpload onFileUpload={handleFileUpload} />
        <div>
          <Label htmlFor="duration" className="text-lg mb-2 block">Exam Duration (hours)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter exam duration"
            className="bg-gray-600 border-gray-500 text-white"
          />
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || files.length === 0 || !duration}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Exam...
            </>
          ) : (
            'Generate Exam'
          )}
        </Button>
        {generatedExam && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Generated Exam</h3>
            <Button 
              onClick={handleDownload}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Download Exam
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

