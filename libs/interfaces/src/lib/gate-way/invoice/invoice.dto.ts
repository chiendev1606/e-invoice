import { ArrayNotEmpty, IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ClientDto {
  @ApiProperty({ description: 'Client name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Client address' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Client email' })
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class ItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Item name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Item quantity' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'VAT rate' })
  @IsNotEmpty()
  @IsNumber()
  vatRate: number;

  @ApiProperty({ description: 'Unit price' })
  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Client information', type: ClientDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ClientDto)
  client: ClientDto;

  @ApiProperty({ description: 'Invoice items', type: [ItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
