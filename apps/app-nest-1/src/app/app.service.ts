import { Injectable } from '@nestjs/common';
import { Trace } from './tracing.decorators';
import { DataService } from './data.service';
import { ApplicationInsightsUtils } from './application-insights.utils';

@Injectable()
export class AppService {
  public static readonly _TRACER = ApplicationInsightsUtils.getTracer(
    AppService.name,
  );

  public constructor(private readonly dataService: DataService) {}

  @Trace(AppService._TRACER)
  public async getData(): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    ApplicationInsightsUtils.addEventToActiveSpan('After wait');
    return this.dataService.getData();
  }

  @Trace(AppService._TRACER)
  async throwException(): Promise<never> {
    const span = ApplicationInsightsUtils.startInternalSpan(
      AppService._TRACER,
      'AppService.throwException -> AppService.getData',
    );
    await this.getData();
    span.end();

    throw new Error('Dummy exception thrown');
  }
}
