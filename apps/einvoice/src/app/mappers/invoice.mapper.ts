import { CreateInvoiceDto } from '@common/interfaces/gate-way/invoice/invoice.dto';
import { Invoice, InvoiceStatus } from '@common/schemas/invoice.schema';

export const mapper = (data: CreateInvoiceDto): Invoice => {
  const _id = new Date().getTime().toString();
  return {
    _id: _id,
    id: _id,
    totalAmount: data.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    vatAmount: data.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity * item.vatRate) / 100, 0),
    client: {
      name: data.client.name,
      address: data.client.address,
      email: data.client.email,
    },
    items: data.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      vatRate: item.vatRate,
      total: item.unitPrice * item.quantity + (item.unitPrice * item.quantity * item.vatRate) / 100,
      unitPrice: item.unitPrice,
    })),
    supervisorId: '',
    fileUrl: '',
    status: InvoiceStatus.CREATED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
