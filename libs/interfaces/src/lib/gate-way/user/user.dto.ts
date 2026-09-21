import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password for the user account', example: 'P@ssw0rd' })
  password: string;

  /** Role `_id` values — must be castable to ObjectId before they reach the schema. */
  @IsMongoId({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  @ApiProperty({ type: [String], example: ['507f1f77bcf86cd799439011'] })
  roles: string[];
}
