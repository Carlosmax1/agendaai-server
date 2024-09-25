import Queue, { Job } from 'bull';
import { dayjs } from '@/lib/dayjs';
import { jobs } from '@/jobs';
import { envs } from '@/envs';
import { RabbitmqServer } from '@/rabbitmq/rabbit-server';

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, {
    redis: {
      tls: {
        rejectUnauthorized: false,
      },
      host: envs.REDIS_HOST,
      port: envs.REDIS_PORT,
      password: envs.REDIS_PASSWORD,
    },
  }),
  name: job.key,
  handle: (jobData: Job<any>) => job.handle(jobData.data),
}));

// Converte a data para o formato cron mensal
function dateToMonthlyCronFormat(date: Date | string) {
  const d = dayjs(date);
  return `${d.minute()} ${d.hour()} ${d.date()} * *`;
}

// Converte a data para o formato cron semanal
function dateToWeeklyCronFormat(date: Date | string) {
  const d = dayjs(date);
  return `${d.minute()} ${d.hour()} * * ${d.day()}`;
}

// Converte a data para o formato cron diário
function dateToDailyCronFormat(date: Date | string) {
  const d = dayjs(date);
  return `${d.minute()} ${d.hour()} * * *`;
}

export const Queues = {
  queues,

  add(name: string, data: Record<string, unknown>, date: Date | string) {
    const queue = this.queues.find((queue) => queue.name === name);

    if (!queue) {
      throw new Error(`Queue with name "${name}" not found`);
    }

    const currentDate = dayjs();
    const scheduledDate = dayjs(date);

    if (scheduledDate.isBefore(currentDate)) {
      throw new Error('Invalid date: The scheduled date cannot be in the past');
    }

    const delay = scheduledDate.diff(currentDate, 'milliseconds');

    // Adiciona o job à fila com o atraso calculado
    return queue.bull.add(data, {
      delay: Math.max(delay, 0), // Garantir que o delay não seja negativo
    });
  },

  addCron(name: string, data: Record<string, unknown>, date: Date | string, frequency: 'daily' | 'weekly' | 'monthly') {
    const queue = this.queues.find((queue) => queue.name === name);

    if (!queue) {
      throw new Error(`Queue with name "${name}" not found`);
    }

    let cron = '';

    switch (frequency) {
      case 'daily':
        cron = dateToDailyCronFormat(date);
        break;
      case 'weekly':
        cron = dateToWeeklyCronFormat(date);
        break;
      case 'monthly':
        cron = dateToMonthlyCronFormat(date);
        break;
      default:
        throw new Error('Invalid frequency');
    }

    return queue.bull.add(data, {
      repeat: {
        cron,
      },
    });
  },

  process() {
    this.queues.forEach((queue) => {
      console.log(`${dayjs().format('DD/MM/YYYY HH:mm:ss')} Queue "${queue.name}" is ready to process jobs`);
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job, error) => {
        console.error(`Job failed in queue "${queue.name}"`, job.data);
        console.error(error);
      });

      queue.bull.on('progress', (job, progress) => {
        console.log(`Job "${job.id}" in queue "${queue.name}" is ${progress}% complete  - ${job.data}`);
      });

      queue.bull.on('error', (error) => {
        console.error(`Error in queue "${queue.name}"`);
        console.error(error);
      });

      queue.bull.on('completed', (job) => {
        console.log(`Job completed in queue "${queue.name}"`, job.data);
      });

      queue.bull.on('waiting', (jobId) => {
        console.log(`Job waiting in queue "${queue.name}" with ID:`, jobId);
      });

      queue.bull.on('active', (job) => {
        console.log(`Job active in queue "${queue.name}"`, job.data);
      });
    });
  },
};
