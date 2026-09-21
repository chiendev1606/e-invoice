import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'chien@email.com',
    description: 'The email address of the user',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '12345678',
    description: 'The password of the user',
  })
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
