'use client'

import ExamGenerator from '@/components/ExamGenerator'
import ThesisGradingHelper from '@/components/ThesisGradingHelper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  // const [activeTab, setActiveTab] = useState('exam-generator')

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="bg-gray-800 bg-opacity-80 backdrop-blur-lg border-gray-700">
        <CardContent className="p-6">
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            AI-Powered Academic Tools
          </h1>
          <Tabs defaultValue="exam-generator" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="exam-generator" className="text-lg">Exam Generator</TabsTrigger>
              <TabsTrigger value="thesis-grading" className="text-lg">Thesis Grading Helper</TabsTrigger>
            </TabsList>
            <TabsContent value="exam-generator">
              <ExamGenerator />
            </TabsContent>
            <TabsContent value="thesis-grading">
              <ThesisGradingHelper />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}

