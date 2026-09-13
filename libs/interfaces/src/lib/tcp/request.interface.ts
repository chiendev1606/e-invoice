export class RequestTCP<T> {
  data: T;
  processID: string;

  constructor(_data: Partial<RequestTCP<T>>) {
    Object.assign(this, _data);
  }
}

export const RequestTCPType = RequestTCP;
export type RequestTCPType<T> = RequestTCP<T>;
