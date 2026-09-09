import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { CONFIGURATION } from '../configuration';

@Module({
  imports: [UserModule],
})
export class AppModule {
  static APP_CONFIGURATION = CONFIGURATION;
}
