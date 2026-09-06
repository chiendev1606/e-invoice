import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
