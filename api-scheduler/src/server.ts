import { Queues } from '@/queues';
import { dayjs } from '@/lib/dayjs';
import { RabbitmqServer } from '@/rabbitmq/rabbit-server';
import { envs } from './envs';

(async () => {
  // try {
  //   const rabbitmqServer = new RabbitmqServer(envs.RABBIT_URI);
  //   await rabbitmqServer.start();
  //   rabbitmqServer.consume('mail-core', (message) => {
  //     const content = message.content.toString();
  //     const data = JSON.parse(content);
  //     Queues.add('mail', data, data.date);
  //   });
  // } catch (error) {
  //   console.error('Error while connecting to RabbitMQ:', error);
  // } finally {
  //   console.log('RabbitMQ consumer is running');
  // }
  Queues.add('mail', {}, dayjs().add(5, 'seconds').toDate());
})();
Queues.process();

console.log('⏰ Scheduler is running');
