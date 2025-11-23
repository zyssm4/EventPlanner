import nodemailer from 'nodemailer';
import { Language } from '../../../shared/types';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EventReminder {
  eventName: string;
  eventDate: Date;
  recipientName: string;
  recipientEmail: string;
  language: Language;
}

interface ChecklistReminder {
  eventName: string;
  itemTitle: string;
  dueDate: Date;
  recipientName: string;
  recipientEmail: string;
  language: Language;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  static isConfigured(): boolean {
    return !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
  }

  static async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Email service not configured. Skipping email send.');
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: `"Event Planner" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, '')
      });
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  static async sendWelcomeEmail(
    email: string,
    name: string,
    language: Language
  ): Promise<boolean> {
    const templates = {
      EN: {
        subject: 'Welcome to Event Planner!',
        html: `
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for joining Event Planner. We're excited to help you plan your perfect event.</p>
          <p>Get started by creating your first event and exploring our features:</p>
          <ul>
            <li>Budget tracking and management</li>
            <li>Interactive checklists</li>
            <li>Timeline planning</li>
            <li>Supplier management</li>
            <li>Export to PDF, Excel, and JSON</li>
          </ul>
          <p>Happy planning!</p>
          <p>The Event Planner Team</p>
        `
      },
      FR: {
        subject: 'Bienvenue sur Event Planner!',
        html: `
          <h1>Bienvenue, ${name}!</h1>
          <p>Merci d'avoir rejoint Event Planner. Nous sommes ravis de vous aider à planifier votre événement parfait.</p>
          <p>Commencez par créer votre premier événement et explorez nos fonctionnalités:</p>
          <ul>
            <li>Suivi et gestion du budget</li>
            <li>Listes de contrôle interactives</li>
            <li>Planification du calendrier</li>
            <li>Gestion des fournisseurs</li>
            <li>Export en PDF, Excel et JSON</li>
          </ul>
          <p>Bonne planification!</p>
          <p>L'équipe Event Planner</p>
        `
      },
      DE: {
        subject: 'Willkommen bei Event Planner!',
        html: `
          <h1>Willkommen, ${name}!</h1>
          <p>Vielen Dank, dass Sie Event Planner beigetreten sind. Wir freuen uns, Ihnen bei der Planung Ihrer perfekten Veranstaltung zu helfen.</p>
          <p>Beginnen Sie mit der Erstellung Ihrer ersten Veranstaltung und erkunden Sie unsere Funktionen:</p>
          <ul>
            <li>Budgetverfolgung und -verwaltung</li>
            <li>Interaktive Checklisten</li>
            <li>Zeitplanung</li>
            <li>Lieferantenverwaltung</li>
            <li>Export nach PDF, Excel und JSON</li>
          </ul>
          <p>Viel Spaß beim Planen!</p>
          <p>Das Event Planner Team</p>
        `
      }
    };

    const template = templates[language];
    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html
    });
  }

  static async sendEventReminder(reminder: EventReminder): Promise<boolean> {
    const daysUntil = Math.ceil(
      (reminder.eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    const templates = {
      EN: {
        subject: `Reminder: ${reminder.eventName} in ${daysUntil} days`,
        html: `
          <h1>Event Reminder</h1>
          <p>Hi ${reminder.recipientName},</p>
          <p>This is a friendly reminder that <strong>${reminder.eventName}</strong> is coming up in <strong>${daysUntil} days</strong>.</p>
          <p>Event Date: ${reminder.eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>Log in to Event Planner to review your checklist and ensure everything is on track!</p>
          <p>Best regards,<br>The Event Planner Team</p>
        `
      },
      FR: {
        subject: `Rappel: ${reminder.eventName} dans ${daysUntil} jours`,
        html: `
          <h1>Rappel d'événement</h1>
          <p>Bonjour ${reminder.recipientName},</p>
          <p>Ceci est un rappel amical que <strong>${reminder.eventName}</strong> arrive dans <strong>${daysUntil} jours</strong>.</p>
          <p>Date de l'événement: ${reminder.eventDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>Connectez-vous à Event Planner pour vérifier votre liste de contrôle!</p>
          <p>Cordialement,<br>L'équipe Event Planner</p>
        `
      },
      DE: {
        subject: `Erinnerung: ${reminder.eventName} in ${daysUntil} Tagen`,
        html: `
          <h1>Veranstaltungserinnerung</h1>
          <p>Hallo ${reminder.recipientName},</p>
          <p>Dies ist eine freundliche Erinnerung, dass <strong>${reminder.eventName}</strong> in <strong>${daysUntil} Tagen</strong> stattfindet.</p>
          <p>Veranstaltungsdatum: ${reminder.eventDate.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>Melden Sie sich bei Event Planner an, um Ihre Checkliste zu überprüfen!</p>
          <p>Mit freundlichen Grüßen,<br>Das Event Planner Team</p>
        `
      }
    };

    const template = templates[reminder.language];
    return this.sendEmail({
      to: reminder.recipientEmail,
      subject: template.subject,
      html: template.html
    });
  }

  static async sendChecklistReminder(reminder: ChecklistReminder): Promise<boolean> {
    const templates = {
      EN: {
        subject: `Task Due: ${reminder.itemTitle}`,
        html: `
          <h1>Checklist Task Reminder</h1>
          <p>Hi ${reminder.recipientName},</p>
          <p>You have a task due for <strong>${reminder.eventName}</strong>:</p>
          <p><strong>${reminder.itemTitle}</strong></p>
          <p>Due Date: ${reminder.dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>Log in to Event Planner to mark it as complete!</p>
          <p>Best regards,<br>The Event Planner Team</p>
        `
      },
      FR: {
        subject: `Tâche à faire: ${reminder.itemTitle}`,
        html: `
          <h1>Rappel de tâche</h1>
          <p>Bonjour ${reminder.recipientName},</p>
          <p>Vous avez une tâche à faire pour <strong>${reminder.eventName}</strong>:</p>
          <p><strong>${reminder.itemTitle}</strong></p>
          <p>Date d'échéance: ${reminder.dueDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>Connectez-vous à Event Planner pour la marquer comme terminée!</p>
          <p>Cordialement,<br>L'équipe Event Planner</p>
        `
      },
      DE: {
        subject: `Aufgabe fällig: ${reminder.itemTitle}`,
        html: `
          <h1>Checklisten-Erinnerung</h1>
          <p>Hallo ${reminder.recipientName},</p>
          <p>Sie haben eine Aufgabe für <strong>${reminder.eventName}</strong>:</p>
          <p><strong>${reminder.itemTitle}</strong></p>
          <p>Fälligkeitsdatum: ${reminder.dueDate.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>Melden Sie sich bei Event Planner an, um sie als erledigt zu markieren!</p>
          <p>Mit freundlichen Grüßen,<br>Das Event Planner Team</p>
        `
      }
    };

    const template = templates[reminder.language];
    return this.sendEmail({
      to: reminder.recipientEmail,
      subject: template.subject,
      html: template.html
    });
  }

  static async sendPasswordReset(
    email: string,
    name: string,
    resetToken: string,
    language: Language
  ): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const templates = {
      EN: {
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset</h1>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the link below to set a new password:</p>
          <p><a href="${resetUrl}">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Event Planner Team</p>
        `
      },
      FR: {
        subject: 'Demande de réinitialisation du mot de passe',
        html: `
          <h1>Réinitialisation du mot de passe</h1>
          <p>Bonjour ${name},</p>
          <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous:</p>
          <p><a href="${resetUrl}">Réinitialiser le mot de passe</a></p>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
          <p>Cordialement,<br>L'équipe Event Planner</p>
        `
      },
      DE: {
        subject: 'Passwort-Zurücksetzung angefordert',
        html: `
          <h1>Passwort zurücksetzen</h1>
          <p>Hallo ${name},</p>
          <p>Wir haben eine Anfrage zur Zurücksetzung Ihres Passworts erhalten. Klicken Sie auf den Link:</p>
          <p><a href="${resetUrl}">Passwort zurücksetzen</a></p>
          <p>Dieser Link läuft in 1 Stunde ab.</p>
          <p>Wenn Sie dies nicht angefordert haben, ignorieren Sie diese E-Mail.</p>
          <p>Mit freundlichen Grüßen,<br>Das Event Planner Team</p>
        `
      }
    };

    const template = templates[language];
    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html
    });
  }
}
