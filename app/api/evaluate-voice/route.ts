import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { question, response, context } = await request.json();
    
    const evaluation = await geminiService.evaluateVoiceResponse(question, response, context);
    
    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error('Error evaluating voice response:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate voice response' },
      { status: 500 }
    );
  }
}