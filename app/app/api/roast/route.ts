import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

function corsHeaders(origin: string | null) {
  // Allow only our own domain
  const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    'Access-Control-Allow-Origin': origin === allowedOrigin ? allowedOrigin : '',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  })
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const headers = corsHeaders(origin)

  if (headers['Access-Control-Allow-Origin'] !== origin) {
    return NextResponse.json(
      { error: 'Origin not allowed' },
      { status: 403, headers }
    )
  }

  try {
    const formData = await req.formData()
    const image = formData.get('image') as File
    const language = formData.get('language') as string
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      throw new Error('Missing GEMINI_API_KEY. Ensure it is defined in your .env file.')
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400, headers: corsHeaders(origin) })
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer())

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: "image/jpeg",
        },
      },
      `Roast this image in a humorous way. Be creative, witty, and funny, but not overly mean. Limit your response to 2-5 sentences, dont give me any option. Please provide the roast in ${language} language.`,
    ])

    return NextResponse.json(
      { roast: result.response.text() },
      { headers: corsHeaders(origin) }
    )
  } catch (error) {
    console.error('Error generating roast:', error)
    return NextResponse.json({ error: 'Failed to generate roast' }, { status: 500, headers: corsHeaders(origin) })
  }
}
