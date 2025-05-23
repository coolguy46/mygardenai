import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage } from '@/types/chat';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);

export async function getChatResponse(messages: ChatMessage[]) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  try {
    // Format the last user message
    const lastMessage = messages[messages.length - 1];

    // Add context from previous messages
    const context = messages
      .slice(0, -1)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `You are a helpful gardening assistant. Previous context:\n${context}\n\nUser question: ${lastMessage.content}\n\nProvide a helpful response about gardening and plant care. Keep it practical, clear and CONCISE.`;

    const result = await model.generateContent([
      { text: prompt },
    ]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Chat generation error:', error);
    throw new Error('Failed to generate response');
  }
}
