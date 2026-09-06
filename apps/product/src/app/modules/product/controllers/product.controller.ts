import { Controller } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { MessagePattern } from '@nestjs/microservices';
import { ProductPattern } from '@common/constants/enums/tcp-patterns.enum';
import { RequestTCP } from '@common/interfaces/tcp/request.interface';
import { CreateProductRequestDto } from '@common/interfaces/gate-way/product/product.dto';
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(ProductPattern.CREATE)
  createProduct(body: RequestTCP<CreateProductRequestDto>) {
    const createProductRequestDto = body.data;
    return this.productService.createProduct(createProductRequestDto);
  }
}
