export class MessageJob {
  async handle(data: { message: string; phone: string }) {
    console.log('Message:', data.message);
    console.log('Phone:', data.phone);

    // Publica na fila de mensagens para enviar uma mensagem no WhatsApp do usuário e do cliente
  }
}
