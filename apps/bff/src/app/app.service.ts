import { Injectable } from '@nestjs/common';
import { ResponseDto } from '@common/interfaces/response.interface';

@Injectable()
export class AppService {
  getData(): ResponseDto<{ message: string }> {
    return new ResponseDto({ data: { message: 'Hello API' } });
  }
}
