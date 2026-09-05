import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION } from '../configuration';
import { getTypeOrmProvider } from '@common/configuration/type-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    getTypeOrmProvider(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
