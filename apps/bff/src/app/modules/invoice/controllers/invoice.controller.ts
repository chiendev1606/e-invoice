import { Body, Controller, Get, Logger, Post, Inject } from '@nestjs/common';
import { CreateInvoiceDto } from '@common/interfaces/gate-way/invoice';
import { TCPClient } from '@common/interfaces/tcp/tcp-client.interface';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { Invoice } from '@common/schemas/invoice.schema';
import { ProcessID } from '@common/decorators/processID.decorator';
import { RequestTCP } from '@common/interfaces/tcp/request.interface';
import { map } from 'rxjs/internal/operators/map';
import { ResponseDto } from '@common/interfaces/gate-way/response.interface';
import { InvoicePattern } from '@common/constants/enums/tcp-patterns.enum';
@Controller('invoices')
export class InvoiceController {
  constructor(@Inject(TCP_SERVICES.INVOICES) private readonly invoiceClient: TCPClient) {}
  @Post()
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto, @ProcessID() processID: string) {
    const requestData: RequestTCP<CreateInvoiceDto> = {
      processID,
      data: createInvoiceDto,
    };
    return this.invoiceClient.send<Invoice, CreateInvoiceDto>(InvoicePattern.CREATE, requestData).pipe(
      map((res) => {
        return new ResponseDto({ data: res.data });
      }),
    );
  }
}
