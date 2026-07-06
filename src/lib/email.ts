import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: parseInt(process.env.SMTP_PORT || '587') === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const from = process.env.SMTP_FROM || 'noreply@pdftools.com'
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'PDFTools'

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
  await transporter.sendMail({
    from,
    to: email,
    subject: `Verify your email - ${appName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Verify your email</h1>
        <p>Thank you for registering with ${appName}.</p>
        <p>Click the button below to verify your email address:</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Verify Email</a>
        <p style="color: #666; font-size: 14px;">Or copy this link: ${url}</p>
        <p style="color: #999; font-size: 12px;">This link expires in 24 hours.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from,
    to: email,
    subject: `Reset your password - ${appName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Reset your password</h1>
        <p>You requested a password reset for your ${appName} account.</p>
        <p>Click the button below to set a new password:</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
        <p style="color: #666; font-size: 14px;">Or copy this link: ${url}</p>
        <p style="color: #999; font-size: 12px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  })
}

export async function sendContactNotification(data: { name: string; email: string; subject: string; message: string }) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pdftools.com'
  await transporter.sendMail({
    from,
    to: adminEmail,
    subject: `Contact Form: ${data.subject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  })
}

export async function sendNewsletterConfirmation(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/confirm?token=${token}`
  await transporter.sendMail({
    from,
    to: email,
    subject: `Confirm subscription - ${appName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Confirm your subscription</h1>
        <p>Please confirm your subscription to the ${appName} newsletter.</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Confirm Subscription</a>
      </div>
    `,
  })
}
