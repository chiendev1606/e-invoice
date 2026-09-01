import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { HttpMessage } from '@common/constants/enums/http-messages.enum';

export class ResponseDto<T> {
  @ApiProperty()
  data?: T;

  @ApiProperty({ type: String })
  message = HttpMessage.OK;

  @ApiProperty()
  statusCode = HttpStatus.OK;

  @ApiProperty()
  processID?: string;

  @ApiProperty()
  duration?: string;

  constructor(_data: Partial<ResponseDto<T>>) {
    Object.assign(this, _data);
  }
}
