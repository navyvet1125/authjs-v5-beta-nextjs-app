import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

const sendEmail = async (email: string, subject: string, html: string) => {
    await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: email,
        subject,
        html,
    });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
    const host = process.env.HOST_URL;
    const from = process.env.EMAIL_FROM!;
    const subject = "Two-factor authentication code";
    const htmlMessage = `<p>Your two-factor authentication code is: <strong>${token}</strong></p>`;
    sendEmail( email, subject, htmlMessage);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const host = process.env.HOST_URL;
  const from = process.env.EMAIL_FROM!;
  const subject = "Verify your email";
  const link = `${host}/auth/new-verification?token=${token}`;
  const htmlMessage = `<p>To verify your email, click <a href="${link}">here</a>.</p>`;

  sendEmail( email, subject, htmlMessage);
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const host = process.env.HOST_URL;
  const from = process.env.EMAIL_FROM!;
  const subject = "Reset your password";
  const link = `${host}/auth/new-password?token=${token}`;
  const htmlMessage = `<p>To reset your password, click <a href="${link}">here</a>.</p>`;

  sendEmail( email, subject, htmlMessage);
}