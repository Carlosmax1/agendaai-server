import { RabbitmqServer } from '@/rabbitmq/rabbit-server';
import { envs } from '@/envs';

export const rabbitmqServer = new RabbitmqServer(envs.RABBIT_URI);
