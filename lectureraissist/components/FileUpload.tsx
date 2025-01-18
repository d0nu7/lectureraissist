'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  onFileUpload: (files: { name: string; url: string }[]) => void
}

const CHUNK_SIZE = 1024 * 1024 * 5 // 5MB chunks

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadChunk = async (chunk: Blob, fileName: string, chunkIndex: number, totalChunks: number) => {
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('fileName', fileName)
    formData.append('chunkIndex', chunkIndex.toString())
    formData.append('totalChunks', totalChunks.toString())

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    return response.json()
  }

  const uploadFile = async (file: File) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const chunk = file.slice(chunkIndex * CHUNK_SIZE, (chunkIndex + 1) * CHUNK_SIZE)
      const result = await uploadChunk(chunk, file.name, chunkIndex, totalChunks)
      setUploadProgress((chunkIndex + 1) / totalChunks * 100)

      if (result.url) {
        return { name: file.name, url: result.url }
      }
    }

    throw new Error('Upload failed')
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

