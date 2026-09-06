import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntityDto } from '../base-entity.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  vatRate: number;
}

export class CreateProductResponseDto extends BaseEntityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  price: number;
}
