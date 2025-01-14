import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  throwException(): never {
    throw new Error('Dummy exception thrown');
  }
}
