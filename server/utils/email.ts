import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailContent {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private _transporter: nodemailer.Transporter;

  constructor() {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_SECURE ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.EMAIL_FROM
    ) {
      throw new Error('Email configuration is missing');
    }

    const config: EmailConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    this._transporter = nodemailer.createTransport(config);
  }

  async sendEmail(content: EmailContent): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: content.to,
        subject: content.subject,
        text: content.text,
        html: content.html,
      };

      await this._transporter.sendMail(mailOptions);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error sending email:', error);
    }
  }
}

export { EmailService, EmailContent };
