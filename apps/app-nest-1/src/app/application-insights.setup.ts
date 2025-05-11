/**
 * How to setup source map uploading:
 * https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript-sdk-configuration#source-map
 */

import { ApplicationInsightsUtils } from './application-insights.utils';

const connectionString =
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env['PUBLIC_AZURE_MONITOR_APPLICATION_INSIGHTS_CONNECTION_STRING']!;
const samplingRate = process.env[
  'PUBLIC_AZURE_MONITOR_APPLICATION_INSIGHTS_SAMPLING_RATE'
]
  ? Number(
      process.env['PUBLIC_AZURE_MONITOR_APPLICATION_INSIGHTS_SAMPLING_RATE'],
    )
  : undefined;

if (connectionString) {
  ApplicationInsightsUtils.initialize(connectionString, samplingRate);
}
