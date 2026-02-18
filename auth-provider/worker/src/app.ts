import amqp from 'amqplib';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const startWorker = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();
    
    const queue = 'user_creation_queue';
    await channel.assertQueue(queue, { durable: true });
    
    channel.prefetch(1);

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const userData = JSON.parse(msg.content.toString());

        await prisma.user.create({
          data: {
            id: userData.id,
            email: userData.email,
            handle: userData.handle,
            name: userData.name,
            profilePic: userData.profilePic,
            provider: userData.provider,
            externalId: String(userData.externalId),
            channelId: userData.channelId
          }
        });

        channel.ack(msg);
      } catch (error) {
        console.error("Worker Error:", error);
        channel.nack(msg, false, true); 
      }
    });
  } catch (error) {
    console.error("Failed to start worker:", error);
    process.exit(1);
  }
};

startWorker();