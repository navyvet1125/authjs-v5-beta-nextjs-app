import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const link = `${process.env.HOST_URL}/auth/new-verification?token=${token}`;
//   const message = `Click the link to verify your email: ${link}`;
  const htmlMessage = `<p>To verify your email, click <a href="${link}">here</a>.</p>`;
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email address",
        html: htmlMessage,
    });
}