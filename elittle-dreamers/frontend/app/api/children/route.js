import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(req) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    let query = supabaseAdmin.from('children').select('*')
    if (profile?.role === 'parent') {
      query = query.eq('parent_id', user.id)
    }

    const { data: children, error: dbError } = await query
    if (dbError) throw dbError

    return NextResponse.json({ success: true, data: children }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'parent') {
      return NextResponse.json({ success: false, message: 'Only parents can add children' }, { status: 403 })
    }

    const { name, date_of_birth, branch_id, notes } = await req.json()
    
    const { data: newChild, error: dbError } = await supabaseAdmin
      .from('children')
      .insert([{ name, date_of_birth, branch_id, notes, parent_id: user.id }])
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({ success: true, data: newChild }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
