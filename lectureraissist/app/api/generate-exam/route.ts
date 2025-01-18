import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { files, duration } = await req.json()

  // TODO: Implement the actual exam generation logic here
  // This could involve downloading the files from the provided URLs,
  // processing them, and generating the exam content

  // For now, we'll return a mock response
  const mockExam = `# Generated Exam

## Question 1
What is the capital of France?

## Question 2
Explain the concept of object-oriented programming.

## Question 3
Describe the process of photosynthesis.

Duration: ${duration} hours

Files used:
${files.map((file: { name: string; url: string }) => `- ${file.name} (${file.url})`).join('\n')}
`

  return NextResponse.json({ exam: mockExam })
}

