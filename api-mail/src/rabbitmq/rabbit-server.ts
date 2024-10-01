import { Connection, Channel, connect, Message } from 'amqplib';

export class RabbitmqServer {
  private conn: Connection | null = null;
  private channel: Channel | null = null;

  constructor(private uri: string) {}

  async start(): Promise<void> {
    try {
      this.conn = await connect(this.uri);
      this.channel = await this.conn.createChannel();
    } catch (error) {
      console.error('Error while connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async publishInQueue(queue: string, message: string) {
    if (!this.channel) {
      throw new Error('Channel is not available');
    }
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async publishInExchange(exchange: string, routingKey: string, message: string): Promise<boolean> {
    if (!this.channel) {
      throw new Error('Channel is not available');
    }
    return this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async consume(queue: string, callback: (message: Message) => void) {
    if (!this.channel) {
      throw new Error('Channel is not available');
    }
    return this.channel.consume(queue, (message) => {
      if (message) {
        callback(message);
        this.channel!.ack(message);
      }
    });
  }

  async stop(): Promise<void> {
    if (this.conn) {
      await this.conn.close();
    }
  }
}
