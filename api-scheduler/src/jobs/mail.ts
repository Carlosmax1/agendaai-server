export class MailJob {
  async handle(data: { email: string; subject: string; content: string }) {
    console.log('Sending email to:', data.email);
    console.log('Subject:', data.subject);
    console.log('Content:', data.content);
  }
}
