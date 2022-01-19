import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

const env = process.env.NODE_ENV || 'dev';

console.log('NODE_ENV: ', process.env.NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `environment/${env}.env`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
