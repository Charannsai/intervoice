import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { role, experienceLevel } = await request.json();
    
    const rounds = await geminiService.generateInterviewRounds(role, experienceLevel);
    
    return NextResponse.json({ rounds });
  } catch (error) {
    console.error('Error generating rounds:', error);
    return NextResponse.json(
      { error: 'Failed to generate interview rounds' },
      { status: 500 }
    );
  }
}