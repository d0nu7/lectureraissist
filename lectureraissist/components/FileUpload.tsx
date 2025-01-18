'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'

interface FileUploadProps {
  onFileUpload: (files: File[]) => void
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles)
    onFileUpload(acceptedFiles)
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt']
    },
    maxSize: 200 * 1024 * 1024, // 200MB
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
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        {isDragActive ? (
          <p className="mt-2">Drop the files here ...</p>
        ) : (
          <p className="mt-2">Drag &apos;n&apos; drop some files here, or click to select files</p>
        )}
        <p className="text-sm text-gray-400 mt-2">
          Supported file types: PDF, PPTX, MD, TXT (Max 200MB per file)
        </p>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Uploaded Files:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="text-gray-300">{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

