import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { jd, fileData, mimeType } = await request.json();
    
    if (!jd) {
      return NextResponse.json({ error: 'Job Description is required' }, { status: 400 });
    }
    
    if (!fileData) {
      return NextResponse.json({ error: 'Resume file data is required' }, { status: 400 });
    }

    const roadmap = await geminiService.generateRoadmap(jd, fileData, mimeType || 'application/pdf');
    
    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}
