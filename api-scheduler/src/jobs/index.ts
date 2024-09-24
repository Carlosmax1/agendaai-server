import { MailJob } from './mail';
import { MessageJob } from './message';
import { PaymentJob } from './payment';

const mailJob = new MailJob();
const messageJob = new MessageJob();
const paymentJob = new PaymentJob();

export const jobs = [
  {
    key: 'mail',
    handle: mailJob.handle,
  },
  {
    key: 'message',
    handle: messageJob.handle,
  },
  {
    key: 'payment',
    handle: paymentJob.handle,
  },
];
