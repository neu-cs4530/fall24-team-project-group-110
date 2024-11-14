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
    let config: EmailConfig;

    if (process.env.MODE === 'development' || process.env.MODE === 'production') {
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

      config = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };
    } else {
      // if code gets here, it means we are in test mode
      config = {
        host: 'test',
        port: 587,
        secure: false,
        auth: {
          user: 'test',
          pass: 'test',
        }
      }
    }

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
