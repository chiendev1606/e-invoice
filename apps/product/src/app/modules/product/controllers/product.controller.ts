import { ProductPattern } from '@common/constants/enums/tcp-patterns.enum';
import { CreateProductRequestDto } from '@common/interfaces/gate-way/product/product.dto';
import { RequestTCP } from '@common/interfaces/tcp/request.interface';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from '../services/product.service';
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(ProductPattern.CREATE)
  createProduct(body: RequestTCP<CreateProductRequestDto>) {
    const createProductRequestDto = body.data;
    return this.productService.createProduct(createProductRequestDto);
  }
}
