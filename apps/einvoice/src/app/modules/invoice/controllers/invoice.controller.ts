import { Controller, Get, Inject } from '@nestjs/common';
import { ResponseDto } from '@common/interfaces/gate-way/response.interface';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCPClient } from '@common/interfaces/tcp/tcp-client.interface';
import { map } from 'rxjs/operators';
import { ProcessID } from '@common/decorators/processID.decorator';
import { InvoiceService } from '../services/invoice.service';
import { MessagePattern } from '@nestjs/microservices';
import { RequestTCPType } from '@common/interfaces/tcp/request.interface';
import { ResponseTCP } from '@common/interfaces/tcp/response.interface';

@Controller('/invoices')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    @Inject(TCP_SERVICES.INVOICES) private readonly invoiceClient: TCPClient,
  ) {}

  @MessagePattern('get_invoice')
  getInvoice(data: RequestTCPType<string>): ResponseTCP<string> {
    return ResponseTCP.success(data.data);
  }
}
