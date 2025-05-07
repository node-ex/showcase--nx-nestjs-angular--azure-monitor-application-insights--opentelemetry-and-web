import { Injectable } from '@nestjs/common';
import { SpanKind, trace, Tracer } from '@opentelemetry/api';
import { Trace } from './tracing.decorators';
import { DataService } from './data.service';

@Injectable()
export class AppService {
  private static readonly TRACER: Tracer = trace.getTracer(AppService.name);

  public constructor(private readonly dataService: DataService) {}

  @Trace(AppService.TRACER)
  public async getData(): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return this.dataService.getData();
  }

  @Trace(AppService.TRACER)
  async throwException(): Promise<never> {
    const span = AppService.TRACER.startSpan(
      'AppService.throwException -> AppService.getData',
      {
        kind: SpanKind.INTERNAL,
      },
    );
    await this.getData();
    span.end();

    throw new Error('Dummy exception thrown');
  }
}
