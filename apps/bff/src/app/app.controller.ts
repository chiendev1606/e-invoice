import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ResponseDto } from '@common/interfaces/response.interface';
import { TCP_SERVICES } from '@common/configuration/tcp.config';

@Controller('/app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(TCP_SERVICES.INVOICES) private readonly invoiceClient: ClientProxy,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('invoice')
  async getInvoice() {
    const invoiceID = await firstValueFrom(this.invoiceClient.send<string, number>('get_invoice', 1));
    return new ResponseDto({ data: invoiceID });
  }
}
