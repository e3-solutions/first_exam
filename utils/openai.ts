import OpenAI from 'openai';

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

// Create OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function for chat completions
export async function generateChatCompletion(messages: any[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw error;
  }
} 