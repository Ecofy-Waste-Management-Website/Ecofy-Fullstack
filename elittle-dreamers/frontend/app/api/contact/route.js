import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { sendEnquiryConfirmation, sendEnquiryNotification } from '@/lib/mailer'

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone, message } = await req.json()
    
    // Validate fields
    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 })
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 })
    }

    // Insert to DB
    const { error: dbError } = await supabaseAdmin
      .from('enquiries')
      .insert([{ first_name: firstName, last_name: lastName, email, phone, message }])
      
    if (dbError) throw dbError

    // Send emails
    await sendEnquiryConfirmation({ firstName, email })
    await sendEnquiryNotification({ firstName, lastName, email, phone, message })

    return NextResponse.json({ success: true, message: 'Enquiry submitted successfully' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
