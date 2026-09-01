import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RequestTCPType } from '@common/interfaces/tcp/request.interface';
import { ResponseTCP } from '@common/interfaces/tcp/response.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('get_invoice')
  getInvoice(data: RequestTCPType<string>): ResponseTCP<string> {
    console.log(data);
    return ResponseTCP.success(data.data);
  }
}
