import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { role, context } = await request.json();
    
    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }
    
    const courses = await geminiService.recommendCourses(role, context || 'Fundamentals');
    
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching course recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
