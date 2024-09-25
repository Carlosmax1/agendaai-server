import { rabbitmqServer } from '@/rabbitmq/rabbit-client';

export class MailJob {
  async handle(data: { email: string; subject: string; content: string }) {
    const { email, subject, content } = data;

    try {
      // Envia a mensagem para a fila do RabbitMQ para o serviço de envio de e-mails
      await rabbitmqServer.publishInQueue('mail', JSON.stringify({ email, subject, content }));
    } catch (error) {
      throw error;
    }
  }
}
