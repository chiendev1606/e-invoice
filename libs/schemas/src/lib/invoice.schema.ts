import { Prop, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseSchema, createSchema } from './base.schema';

class Client {
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  address: string;
  @Prop({ type: String })
  email: string;
}

enum InvoiceStatus {
  CREATED = 'CREATED',
  SENT = 'SENT',
  PAID = 'PAID',
}

class Item {
  @Prop({ type: String })
  productId: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: Number })
  vatRate: number;

  @Prop({ type: Number })
  total: number;

  @Prop({ type: Number })
  unitPrice: number;
}

@Schema({
  collection: 'invoices',
})
export class Invoice extends BaseSchema {
  @Prop({ type: Client })
  client: Client;

  @Prop({ type: Number })
  totalAmount: number;

  @Prop({ type: Number })
  vatAmount: number;

  @Prop({ type: String, enum: InvoiceStatus, default: InvoiceStatus.CREATED })
  status: InvoiceStatus;

  @Prop({ type: [Item] })
  items: Item[];
}

const InvoiceSchema = createSchema(Invoice);

export const InvoiceModelName = Invoice.name;

export const InvoiceDestination = {
  name: Invoice.name,
  schema: InvoiceSchema,
};

export type InvoiceModel = Model<Invoice>;
