import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductRequestDto } from '@common/interfaces/gate-way/product/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  getAllProduct() {
    return this.productRepository.getAll();
  }

  createProduct(createProductRequestDto: CreateProductRequestDto) {
    return this.productRepository.create(createProductRequestDto);
  }
}
