import { Module } from '@nestjs/common';
import { CONFIGURATION } from '../configuration';

@Module({
  imports: [],
})
export class AppModule {
  static APP_CONFIGURATION = CONFIGURATION;
}
