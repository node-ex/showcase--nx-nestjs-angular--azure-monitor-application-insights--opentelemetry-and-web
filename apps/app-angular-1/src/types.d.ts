declare const process: {
  env: {
    PUBLIC_GREETING: string;
    PUBLIC_AZURE_MONITOR_APPLICATION_INSIGHTS_CONNECTION_STRING:
      | string
      | undefined;
    PUBLIC_AZURE_MONITOR_APPLICATION_INSIGHTS_SAMPLING_RATE: string | undefined;
  };
};
