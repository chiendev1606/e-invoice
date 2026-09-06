import { ProductEntity } from '@common/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(ProductEntity) private readonly repo: Repository<ProductEntity>) {}

  create(product: Partial<ProductEntity>) {
    const newProduct = this.repo.create(product);
    return this.repo.save(newProduct);
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  getAll() {
    return this.repo.find();
  }

  exist(id: string) {
    return this.repo.exists({ where: { id } });
  }

  updateById(id: string, updates: Partial<ProductEntity>) {
    return this.repo.update({ id }, updates);
  }
}
