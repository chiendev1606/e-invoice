import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class LoginResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accessToken: string;
}
