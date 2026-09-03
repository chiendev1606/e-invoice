import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { InvoicePattern } from '@common/constants/enums/tcp-patterns.enum';
import { CreateInvoiceTCPRequestType, CreateInvoiceTCPResponseType } from '@common/interfaces/tcp/invoice.interface';
import { RequestTCPType } from '@common/interfaces/tcp/request.interface';
import { ResponseTCP } from '@common/interfaces/tcp/response.interface';
import { TCPClient } from '@common/interfaces/tcp/tcp-client.interface';
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InvoiceService } from '../services/invoice.service';
import { mapper } from '../../../mappers/invoice.mapper';

@Controller('/invoices')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    @Inject(TCP_SERVICES.INVOICES) private readonly invoiceClient: TCPClient,
  ) {}

  @MessagePattern(InvoicePattern.CREATE)
  createInvoice(data: RequestTCPType<CreateInvoiceTCPRequestType>): ResponseTCP<CreateInvoiceTCPResponseType> {
    return ResponseTCP.success(mapper(data.data));
  }
}
