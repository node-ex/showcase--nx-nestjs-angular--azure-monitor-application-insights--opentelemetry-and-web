import {
  AzureMonitorOpenTelemetryOptions,
  useAzureMonitor,
} from '@azure/monitor-opentelemetry';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { trace, metrics, ProxyTracerProvider } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
// import { FsInstrumentation } from '@opentelemetry/instrumentation-fs';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';

export class ApplicationInsightsUtils {
  /**
   * Setup guide:
   * https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable?tabs=nodejs
   * https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-configuration?tabs=nodejs
   */
  static initialize(connectionString: string) {
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
        http: {
          enabled: true,
        },
        azureSdk: { enabled: true },
        // mongoDb: { enabled: true },
        // mySql: { enabled: true },
        // postgreSql: { enabled: true },
        // redis: { enabled: true },
        // redis4: { enabled: true },
      },
      /* https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-configuration?tabs=nodejs#enable-sampling */
      samplingRatio: 1.0,
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
         *
         * Automatically catches unhandled exceptions, but produces duplicated
         * entries in the Application Insights.
         */
        new NestInstrumentation(),
      ],
      tracerProvider: tracerProvider,
      meterProvider: meterProvider,
    });
  }
}
