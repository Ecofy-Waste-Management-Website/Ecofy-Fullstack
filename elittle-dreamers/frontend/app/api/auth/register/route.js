import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { firstName, lastName, email, password, role } = await req.json()
    
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 })
    }

    if (role !== 'parent' && role !== 'teacher') {
      return NextResponse.json({ success: false, message: 'Role must be parent or teacher' }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role
        }
      }
    })

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Account created. Check email to confirm.' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}
