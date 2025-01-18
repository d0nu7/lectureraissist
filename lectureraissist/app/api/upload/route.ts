import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData()
  const chunk = formData.get('chunk') as Blob
  const fileName = formData.get('fileName') as string
  const chunkIndex = formData.get('chunkIndex') as string
  const totalChunks = formData.get('totalChunks') as string

  if (!chunk || !fileName || !chunkIndex || !totalChunks) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const blobName = `${fileName}.part${chunkIndex}`
    await put(blobName, chunk, {
      access: 'public',
    })

    if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
      // All chunks uploaded, combine them
      const combinedBlob = await combineChunks(fileName, parseInt(totalChunks))
      return NextResponse.json({ url: combinedBlob.url })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error uploading chunk:', error)
    return NextResponse.json({ error: 'Error uploading chunk' }, { status: 500 })
  }
}

async function combineChunks(fileName: string, totalChunks: number) {
  const chunks = []
  for (let i = 0; i < totalChunks; i++) {
    // const chunkName = `${fileName}.part${i}`
    const chunkBlob = await fetch(`https://${process.env.VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com/${fileName}.part${i}`).then(res => res.blob())
    chunks.push(chunkBlob)
  }

  const combinedBlob = new Blob(chunks)
  const finalBlob = await put(fileName, combinedBlob, { access: 'public' })

  // Clean up chunk files
  for (let i = 0; i < totalChunks; i++) {
    // const chunkName = `${fileName}.part${i}`
    // Note: Implement delete function for Vercel Blob when it becomes available
    // await del(chunkName)
  }

  return finalBlob
}

export const config = {
  api: {
    bodyParser: false,
  },
}

