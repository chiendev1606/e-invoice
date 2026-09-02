import { Invoice, InvoiceModelName, InvoiceStatus } from '@common/schemas/invoice.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class InvoiceRepository {
  constructor(@InjectModel(InvoiceModelName) private invoiceModel: Model<Invoice>) {}

  getAll() {
    return this.invoiceModel.find().exec();
  }

  getById(id: string) {
    return this.invoiceModel.findById(id).exec();
  }

  create(data: Partial<Invoice>) {
    return this.invoiceModel.create({ ...data, status: InvoiceStatus.CREATED });
  }

  findAndUpdate(id: string, data: Partial<Invoice>) {
    return this.invoiceModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
