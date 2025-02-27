import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File
    const language = formData.get('language') as string
    const intensity = formData.get('intensity') as string
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      throw new Error('Missing GEMINI_API_KEY. Ensure it is defined in your .env file.')
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer())

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: "image/jpeg",
        },
      },
      `Analyze the provided image and deliver a humorous roast in ${language}. Be creative, witty, and funny, with a roast intensity or mean level set to ${intensity} out of 100 (0 = Mild, 50 = Spicy, 100 = Brutal). Your response should be limited to 2-5 sentences, and no additional options or explanations should be included.`
    ])

    return NextResponse.json({ roast: result.response.text() })
  } catch (error) {
    console.error('Error generating roast:', error)
    return NextResponse.json({ error: 'Failed to generate roast' }, { status: 500 })
  }
}
