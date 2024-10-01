import nodeMailer from 'nodemailer';
import { envs } from '@/envs';

export const transporter = nodeMailer.createTransport({
  host: envs.SMTP_HOST,
  port: envs.SMTP_PORT,
  secure: envs.SMPT_SECURE,
  auth: {
    user: envs.SMTP_USER,
    pass: envs.SMTP_PASS,
  },
});
