import { Observable } from 'rxjs';
import { RequestTCPType } from './request.interface';
import { ResponseTCPType } from './response.interface';

export interface TCPClient {
  send<TResult = any, TInput = any>(pattern: any, data: RequestTCPType<TInput>): Observable<ResponseTCPType<TResult>>;
  emit<TResult = any, TInput = any>(pattern: any, data: RequestTCPType<TInput>): Observable<ResponseTCPType<TResult>>;
}
