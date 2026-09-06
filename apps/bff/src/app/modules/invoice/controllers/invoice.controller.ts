import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { InvoicePattern } from '@common/constants/enums/tcp-patterns.enum';
import { ProcessID } from '@common/decorators/processID.decorator';
import { CreateInvoiceDto } from '@common/interfaces/gate-way/invoice';
import { ResponseDto } from '@common/interfaces/gate-way/response.interface';
import { RequestTCP } from '@common/interfaces/tcp/request.interface';
import { TCPClient } from '@common/interfaces/tcp/tcp-client.interface';
import { Invoice } from '@common/schemas/invoice.schema';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { map } from 'rxjs/operators';
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
