import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ThesisGradingHelper() {
  return (
    <Card className="bg-gray-700 bg-opacity-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">Thesis Grading Helper</CardTitle>
        <CardDescription className="text-gray-300">
          This feature is currently under development. Stay tuned for updates!
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

