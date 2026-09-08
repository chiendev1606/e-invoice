import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  /** Role `_id` values — must be castable to ObjectId before they reach the schema. */
  @IsMongoId({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  @ApiProperty({ type: [String], example: ['507f1f77bcf86cd799439011'] })
  roles: string[];
}
