import { Invoice } from '@common/schemas/invoice.schema';
import { CreateInvoiceDto } from '../gate-way/invoice/invoice.dto';

export type CreateInvoiceTCPRequestType = CreateInvoiceDto;
export type CreateInvoiceTCPResponseType = Invoice;
