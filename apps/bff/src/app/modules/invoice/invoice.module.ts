import { Module } from '@nestjs/common';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { getTcpProvider, TCP_SERVICES } from '@common/configuration/tcp.config';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.registerAsync(getTcpProvider(TCP_SERVICES.INVOICES))],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
