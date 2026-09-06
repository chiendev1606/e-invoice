import { Controller, Post } from '@nestjs/common';
import { CreateProductRequestDto } from '@common/interfaces/gate-way/product/product.dto';

@Controller('/product')
export class ProductController {}
