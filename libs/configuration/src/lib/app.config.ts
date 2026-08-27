import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseConfiguration } from './base.config';

export class AppConfiguration extends BaseConfiguration {
  @IsNumber()
  @IsNotEmpty()
  PORT: number;
  constructor() {
    super();
    this.PORT = Number(process.env['PORT']) || 3000;
  }
}
