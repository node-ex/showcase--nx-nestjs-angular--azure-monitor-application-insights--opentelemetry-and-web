import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { trace } from '@opentelemetry/api';

/**
 * Copy-pasted from:
 * https://docs.nestjs.com/exception-filters#catch-everything
 */
@Catch()
export class GlobalCatchAllExceptionFilter extends BaseExceptionFilter {
  override catch(exception: unknown, host: ArgumentsHost): void {
    /*
     * Record the exception manually:
     * https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-add-modify?tabs=nodejs#add-custom-exceptions
     */
    // const span = tracer.startSpan('uncaught-exception');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const span = trace.getActiveSpan()!;
    span.recordException(exception as Error);
    // span.end();

    super.catch(exception, host);
  }
}
