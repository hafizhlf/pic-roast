import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface RoastResultProps {
  roast: string
}

export function RoastResult({ roast }: RoastResultProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <motion.h3 
          className="text-lg font-semibold mb-2 bg-gradient-to-r from-orange-400 to-red-600 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          The AI Roast:
        </motion.h3>
        <motion.p 
          className="text-muted-foreground italic text-lg"
          lang={roast.startsWith('en') ? 'en' : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          &ldquo;{roast}&rdquo;
        </motion.p>
      </CardContent>
    </Card>
  )
}
