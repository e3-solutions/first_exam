import { NextResponse } from 'next/server';
import { openai } from '../../../utils/openai';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (error: any) {
    console.error('Error in chat completion:', error.response?.data || error);
    return NextResponse.json(
      { error: 'Failed to generate chat completion' },
      { status: 500 }
    );
  }
} 