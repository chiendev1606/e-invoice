import { ProductEntity } from '@common/entities/product.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductRequestDto } from '@common/interfaces/gate-way/product/product.dto';

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(ProductEntity) private readonly repo: Repository<ProductEntity>) {}

  async create(product: CreateProductRequestDto) {
    const exists = await this.exist(product?.name, product.sku);
    if (exists) {
      throw new BadRequestException('Product with the same name and SKU already exists');
    }
    // Removed as it's now handled above
    const newProduct = this.repo.create(product);
    return this.repo.save(newProduct);
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  getAll() {
    return this.repo.find();
  }

  exist(name: string, sku: string) {
    return this.repo.exists({ where: { name, sku } });
  }

  updateById(id: string, updates: Partial<ProductEntity>) {
    return this.repo.update({ id }, updates);
  }
}
