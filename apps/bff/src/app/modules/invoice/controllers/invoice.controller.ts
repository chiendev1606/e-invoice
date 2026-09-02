import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { CreateInvoiceDto } from '@common/interfaces/gate-way/invoice';

@Controller('invoices')
export class InvoiceController {
  @Post()
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    Logger.log('Creating invoice:', createInvoiceDto);
  }
}
