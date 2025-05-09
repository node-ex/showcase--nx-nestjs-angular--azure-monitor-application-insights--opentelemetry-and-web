
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

export class ApplicationInsightsUtils {
  private static _client: ApplicationInsights | undefined;

  public static set client(value: ApplicationInsights) {
    this._client = value;
  }

  public static get client(): ApplicationInsights | undefined {
    return this._client;
  }

  public static initialize(connectionString: string): void {
    const appInsights = new ApplicationInsights({
      config: {
        connectionString,
      },
    });

    appInsights.loadAppInsights();
    appInsights.trackPageView();

    this.client = appInsights;
  }
}