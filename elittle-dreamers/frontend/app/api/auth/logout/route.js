import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    await supabase.auth.signOut()
    return NextResponse.json({ success: true, message: 'Logged out successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
