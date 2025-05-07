import { Injectable } from '@nestjs/common';
import { TraceClass } from './tracing.decorators';

@Injectable()
@TraceClass()
export class DataService {
  public getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
