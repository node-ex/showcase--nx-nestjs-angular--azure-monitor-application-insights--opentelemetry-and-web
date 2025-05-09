import { Injectable } from '@nestjs/common';
import { TraceClass } from './tracing.decorators';
import { trace, Tracer } from '@opentelemetry/api';

@Injectable()
@TraceClass()
export class DataService {
  public static readonly _TRACER: Tracer = trace.getTracer(DataService.name);

  public getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
