import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gate-way/response.interface';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCPClient } from '@common/interfaces/tcp/tcp-client.interface';
import { map } from 'rxjs/operators';

@Controller('/app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(TCP_SERVICES.INVOICES) private readonly invoiceClient: TCPClient,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('invoice')
  async getInvoice() {
    return this.invoiceClient
      .send<string, string>('get_invoice', {
        processID: '123',
        data: '1',
      })
      .pipe(
        map((res) => {
          console.log(res);
          return new ResponseDto({ data: res.data });
        }),
      );
  }
}
