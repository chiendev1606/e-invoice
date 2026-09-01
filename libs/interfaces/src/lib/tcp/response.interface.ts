import { HttpStatus } from '@nestjs/common';
import { HttpMessage } from '@common/constants/enums/http-messages.enum';

export class ResponseTCP<T> {
  code: string;
  data?: T;
  error?: string;
  statusCode: number;
  constructor(_data: Partial<ResponseTCP<T>>) {
    this.code = _data.code || HttpMessage.OK;
    this.error = _data.error;
    this.statusCode = _data.statusCode || HttpStatus.OK;
    this.constructor = _data.constructor;
    this.data = _data.data;
  }

  static success<T>(data: T): ResponseTCP<T> {
    return new ResponseTCP<T>({ data });
  }
}

export type ResponseTCPType<T> = ResponseTCP<T>;
