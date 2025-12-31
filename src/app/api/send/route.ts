import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = 'djblanc360@gmail.com';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()
    
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Missing required fields: name, email, or message' },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: toEmail, //email,
      to: [toEmail],
      replyTo: email,
      subject: `Inquiry from ${name}`,
      react: EmailTemplate({ name, email, message }),
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Email send error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}