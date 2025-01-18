'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  onFileUpload: (files: { name: string; url: string }[]) => void
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return { name: file.name, url: data.url }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setUploadProgress(0)

    const uploadedFiles = []
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i]
      try {
        const uploadedFile = await uploadFile(file)
        uploadedFiles.push(uploadedFile)
        setUploadProgress((i + 1) / acceptedFiles.length * 100)
      } catch (error) {
        console.error('Error uploading file:', error)
        // Handle error (e.g., show error message to user)
      }
    }

    setUploadedFiles(uploadedFiles)
    onFileUpload(uploadedFiles)
    setUploading(false)
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt']
    },
    // Remove maxSize limit as we're now using Vercel Blobs
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-gray-500 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div>
            <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
            <p className="mt-2">Uploading...</p>
            <Progress value={uploadProgress} className="w-full mt-2" />
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            {isDragActive ? (
              <p className="mt-2">Drop the files here ...</p>
            ) : (
              <p className="mt-2">Drag &apos;n&apos; drop some files here, or click to select files</p>
            )}
          </>
        )}
        <p className="text-sm text-gray-400 mt-2">
          Supported file types: PDF, PPTX, MD, TXT
        </p>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Uploaded Files:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="text-gray-300">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

