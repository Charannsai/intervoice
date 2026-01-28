import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { user_id, role, experience_level, rounds } = await request.json();
    
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert({
        user_id,
        role,
        experience_level,
        rounds,
        status: 'in_progress',
        overall_score: 0
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ session: data });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { session_id, overall_score, status } = await request.json();
    
    const { data, error } = await supabase
      .from('interview_sessions')
      .update({
        overall_score,
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', session_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ session: data });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}