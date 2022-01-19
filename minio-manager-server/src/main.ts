import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

process.on('unhandledRejection', (reason: any, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3000);
}
bootstrap();
