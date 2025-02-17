import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor() {
    super();
  }
  
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Método que se llama antes de que la aplicación se apague (útil en reinicios)
  async onApplicationShutdown(signal: string) {
    console.log(
      `PrismaClient: Conexión cerrada al recibir la señal ${signal}.`,
    );
    await this.$disconnect();
  }

  async enableShutdownHooks(app: any) {
    process.on('SIGINT', async () => {
      await this.$disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.$disconnect();
      process.exit(0);
    });

    process.on('uncaughtException', async (err) => {
      console.error('Uncaught Exception:', err);
      await this.$disconnect();
      process.exit(1);
    });

    process.on('unhandledRejection', async (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      await this.$disconnect();
      process.exit(1);
    });
  }
}
