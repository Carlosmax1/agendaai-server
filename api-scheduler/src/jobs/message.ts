import { rabbitmqServer } from '@/rabbitmq/rabbit-client';

export class MessageJob {
  async handle(data: { message: string; phone: string }) {
    const { message, phone } = data;
    try {
      // Envia a mensagem para a fila do RabbitMQ para o serviço de envio de mensagens no WhatsApp
      await rabbitmqServer.publishInQueue('whatsapp', JSON.stringify({ message, phone }));
    } catch (error) {
      throw error;
    }
  }
}
