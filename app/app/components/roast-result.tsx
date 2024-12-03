import { Card, CardContent } from "@/components/ui/card"

interface RoastResultProps {
  roast: string
}

export function RoastResult({ roast }: RoastResultProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">The AI Roast:</h3>
        <p className="text-gray-700 italic">&ldquo;{roast}&rdquo;</p>
      </CardContent>
    </Card>
  )
}
