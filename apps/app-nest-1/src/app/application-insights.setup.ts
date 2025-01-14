/**
 * How to setup source map uploading:
 * https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript-sdk-configuration#source-map
 */

import { ApplicationInsightsUtils } from './application-insights.utils';

// console.log(
//   "process.env['AZURE_MONITOR_APPLICATION_INSIGHTS_CONNECTION_STRING']",
//   process.env['AZURE_MONITOR_APPLICATION_INSIGHTS_CONNECTION_STRING'],
// );

ApplicationInsightsUtils.initialize(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env['AZURE_MONITOR_APPLICATION_INSIGHTS_CONNECTION_STRING']!,
);
