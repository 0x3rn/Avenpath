import { Resend } from 'resend';

// Only instantiate if the key exists, to prevent crashing on boot
export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.warn("Resend API Key is missing. Email not sent.");
    return false;
  }
  
  try {
    const data = await resend.emails.send({
      from: 'Avenpath <noreply@avenpath.com>',
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
