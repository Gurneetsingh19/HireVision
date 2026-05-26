import { NextResponse } from 'next/server';

const MOCK_QUESTIONS = [
  "That's a good approach. Can you explain how you would handle complex state management in a large-scale Next.js application without using Redux?",
  "Interesting. How do you ensure your components remain accessible and performant when dealing with large datasets?",
  "Could you describe a time when you had to debug a particularly difficult frontend issue?",
  "Thank you for sharing that. This concludes our technical questions."
];

export async function POST(request) {
  const { messages } = await request.json();
  
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Count how many user messages exist to determine the next question
  const userMessageCount = messages.filter(m => m.role === 'user').length;
  
  const nextQuestion = MOCK_QUESTIONS[Math.min(userMessageCount, MOCK_QUESTIONS.length - 1)];

  return NextResponse.json({
    role: 'assistant',
    content: nextQuestion
  });
}
