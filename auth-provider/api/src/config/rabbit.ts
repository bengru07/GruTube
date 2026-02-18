import amqp from 'amqplib';
import { USER_CREATION_QUEUE } from './queues.js';

let channel: amqp.Channel;

export const connectRabbit = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();
    await channel.assertQueue(USER_CREATION_QUEUE, { durable: true });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const publishUserCreation = (userData: any) => {
  if (!channel) {
    console.error('RabbitMQ channel is not initialized');
    return;
  }

  channel.sendToQueue(USER_CREATION_QUEUE, Buffer.from(JSON.stringify(userData)), {
    persistent: true,
  });
};