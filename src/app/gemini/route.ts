import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userMessage } = await req.json();

    // Dummy response for now
    const aiMessage = `Gemini AI response to: ${userMessage}`;

    return NextResponse.json({ aiMessage });
  } catch (err) {
    return NextResponse.json({ error: 'Error handling request' }, { status: 500 });
  }
}
