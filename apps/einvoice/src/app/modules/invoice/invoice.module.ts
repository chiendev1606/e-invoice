import { Module } from '@nestjs/common';
import { InvoiceRepository } from './repositories/invoice.repository';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';
import { ClientsModule } from '@nestjs/microservices';
import { getTcpProvider, TCP_SERVICES } from '@common/configuration/tcp.config';
import { getMongoDbProvider } from '@common/configuration/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceDestination } from '@common/schemas/invoice.schema';

@Module({
  imports: [
    ClientsModule.registerAsync(getTcpProvider(TCP_SERVICES.INVOICES)),
    getMongoDbProvider(),
    MongooseModule.forFeature([InvoiceDestination]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceRepository, InvoiceService],
})
export class InvoiceModule {}
