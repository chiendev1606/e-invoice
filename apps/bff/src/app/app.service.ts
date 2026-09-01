import { Injectable } from '@nestjs/common';
import { ResponseDto } from '@common/interfaces/gate-way/response.interface';

@Injectable()
export class AppService {
  getData(): ResponseDto<{ message: string }> {
    return new ResponseDto({ data: { message: 'Hello API' } });
  }
}
