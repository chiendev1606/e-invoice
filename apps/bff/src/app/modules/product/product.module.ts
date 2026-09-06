import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';
import { getTcpProvider, TCP_SERVICES } from '@common/configuration/tcp.config';

@Module({
  imports: [ClientsModule.registerAsync(getTcpProvider(TCP_SERVICES.PRODUCTS))],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
