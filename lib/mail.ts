import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

const sendEmail = async (from: string, email: string, subject: string, html: string) => {
    await resend.emails.send({
        from,
        to: email,
        subject,
        html,
    });
};


export const sendVerificationEmail = async (email: string, token: string) => {
  const host = process.env.HOST_URL;
  const from = "onboarding@resend.dev";
  const subject = "Verify your email";
  const link = `${host}/auth/new-verification?token=${token}`;
  const htmlMessage = `<p>To verify your email, click <a href="${link}">here</a>.</p>`;

  sendEmail(from, email, subject, htmlMessage);
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const host = process.env.HOST_URL;
  const from = "onboarding@resend.dev";
  const subject = "Reset your password";
  const link = `${host}/auth/new-password?token=${token}`;
  const htmlMessage = `<p>To reset your password, click <a href="${link}">here</a>.</p>`;

  sendEmail(from, email, subject, htmlMessage);
}