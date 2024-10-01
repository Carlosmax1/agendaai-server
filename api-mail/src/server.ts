import { Mail } from '@/interfaces/mail.interface';
import { transporter } from '@/mail/config';
import { rabbitmqServer } from '@/rabbitmq/rabbit-client';

(async () => {
  await rabbitmqServer.start();
  await rabbitmqServer.consume('send_mail', async (message) => {
    const data: Mail = JSON.parse(message.content.toString());
    await transporter.sendMail(data);
  });
})();

process.on('beforeExit', async () => {
  await rabbitmqServer.stop();
});

process.on('SIGINT', async () => {
  await rabbitmqServer.stop();
  process.exit();
});
