import {
  AzureMonitorOpenTelemetryOptions,
  useAzureMonitor,
} from '@azure/monitor-opentelemetry';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

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
      },
      /* https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-configuration?tabs=nodejs#enable-sampling */
      samplingRatio: 1.0,
      enableStandardMetrics: true,
      /* https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-configuration?tabs=nodejs#live-metrics */
      enableLiveMetrics: false,
    };

    useAzureMonitor(options);

    /**
     * NestJS specific instrumentation:
     * https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-add-modify?tabs=nodejs#add-a-community-instrumentation-library
     * https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-nestjs-core
     *
     * Automatically catches unhandled exceptions, but produces duplicated
     * entries in the Application Insights.
     */
    // registerInstrumentations({
    //   instrumentations: [new NestInstrumentation()],
    // });
  }
}
