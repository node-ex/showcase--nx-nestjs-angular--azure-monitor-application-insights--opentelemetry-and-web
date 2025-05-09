import { ApplicationInsightsUtils } from './application-insights.utils';

const connectionString = process.env['PUBLIC_AZURE_MONITOR_APPLICATION_INSIGHTS_CONNECTION_STRING'];

ApplicationInsightsUtils.initialize(connectionString);
