import {
  AzureMonitorOpenTelemetryOptions,
  useAzureMonitor,
} from '@azure/monitor-opentelemetry';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import {
  trace,
  metrics,
  ProxyTracerProvider,
  Tracer,
  Span,
  SpanKind,
} from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
// import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
// import { FsInstrumentation } from '@opentelemetry/instrumentation-fs';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

export class ApplicationInsightsUtils {
  /**
   * Setup guide:
   * https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable?tabs=nodejs
   * https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-configuration?tabs=nodejs
   */
  public static initialize(connectionString: string, samplingRate = 1.0) {
    const customResource = new Resource({
      [ATTR_SERVICE_NAME]: 'my-service',
    });

    const options: AzureMonitorOpenTelemetryOptions = {
      /* https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-configuration?tabs=nodejs#set-the-cloud-role-name-and-the-cloud-role-instance */
      resource: customResource,
      /* https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-configuration?tabs=nodejs#connection-string */
      azureMonitorExporterOptions: {
        connectionString,
      },
      /* https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-add-modify?tabs=nodejs#included-instrumentation-libraries */
      instrumentationOptions: {
        http: { enabled: true },
        azureSdk: { enabled: true },
        // mongoDb: { enabled: true },
        // mySql: { enabled: true },
        // postgreSql: { enabled: true },
        // redis: { enabled: true },
        // redis4: { enabled: true },
      },
      /* https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-configuration?tabs=nodejs#enable-sampling */
      samplingRatio: samplingRate,
      enableStandardMetrics: true,
      /* https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-configuration?tabs=nodejs#live-metrics */
      enableLiveMetrics: false,
    };

    useAzureMonitor(options);

    const tracerProvider = (
      trace.getTracerProvider() as ProxyTracerProvider
    ).getDelegate();
    const meterProvider = metrics.getMeterProvider();

    registerInstrumentations({
      instrumentations: [
        /**
         * Produces a lot of "Accessing resource attributes before async attributes settled []"
         * console messages and produces a lot of dependency spans when run
         * inside NestJS dev server.
         */
        // new FsInstrumentation(),
        /**
         * NestJS specific instrumentation:
         * https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-add-modify?tabs=nodejs#add-a-community-instrumentation-library
         * https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-nestjs-core
         */
        // new NestInstrumentation(),
        /*
         * https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node
         * https://opentelemetry.io/docs/languages/js/getting-started/nodejs/
         */
        getNodeAutoInstrumentations(),
      ],
      tracerProvider: tracerProvider,
      meterProvider: meterProvider,
    });
  }

  public static getTracer(name: string): Tracer {
    return trace.getTracer(name);
  }

  public static startInternalSpan(tracer: Tracer, spanName: string): Span {
    return tracer.startSpan(spanName, {
      kind: SpanKind.INTERNAL,
    });
  }

  public static getActiveSpan() {
    return trace.getActiveSpan();
  }

  public static addEventToActiveSpan(event: string) {
    ApplicationInsightsUtils.getActiveSpan()?.addEvent(event);
  }
}
