import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ProductPattern } from '@common/constants/enums/tcp-patterns.enum';
import { ProcessID } from '@common/decorators/processID.decorator';
import { CreateProductRequestDto, CreateProductResponseDto } from '@common/interfaces/gate-way/product/product.dto';
import { TCPClient } from '@common/interfaces/tcp/tcp-client.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('product')
@Controller('/product')
export class ProductController {
  constructor(@Inject(TCP_SERVICES.PRODUCTS) private readonly productClient: TCPClient) {}
  @Post()
  @ApiProperty({ type: CreateProductResponseDto })
  createProduct(@Body() createProductRequestDto: CreateProductRequestDto, @ProcessID() processID: string) {
    return this.productClient.send<CreateProductResponseDto, CreateProductRequestDto>(ProductPattern.CREATE, {
      data: createProductRequestDto,
      processID,
    });
  }
}
