import { Queues } from '@/queues';
import { rabbitmqServer } from '@/rabbitmq/rabbit-client';

(async () => {
  try {
    await rabbitmqServer.start();
    // Consome as mensagens das filas para adicionar os jobs de envio de mensagens no whatsap
    rabbitmqServer.consume('wp-core', (message) => {
      const content = message.content.toString(); // action, payload, date
      const data = JSON.parse(content);
      Queues.add('message', data, data.date);
    });
    // Consome as mensagens das filas para adicionar os jobs de envio de e-mails
    rabbitmqServer.consume('mail-core', (message) => {
      const content = message.content.toString(); // action, payload, date
      const data = JSON.parse(content);
      Queues.add('mail', data, data.date);
    });
  } catch (error) {
    console.error('Error', error);
  } finally {
    console.log('RabbitMQ consumer is running');
  }
})();

Queues.process();

console.log('⏰ Scheduler is running');
