import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntityDto } from '../base-entity.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sku: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @ApiProperty()
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
