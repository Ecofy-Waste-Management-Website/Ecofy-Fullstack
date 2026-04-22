import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendEnquiryConfirmation({ firstName, email }) {
  await transporter.sendMail({
    from: `"Elittle Dreamers" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank you for contacting Elittle Dreamers',
    html: `
      <h2>Hi ${firstName},</h2>
      <p>Thank you for reaching out to Elittle Dreamers.</p>
      <p>We have received your message and will get back to you within 24 hours.</p>
      <p>Warm regards,<br/>The Elittle Dreamers Team</p>
    `
  })
}

export async function sendEnquiryNotification({ firstName, lastName, email, phone, message }) {
  await transporter.sendMail({
    from: `"Elittle Dreamers Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Enquiry from ${firstName} ${lastName}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  })
}
