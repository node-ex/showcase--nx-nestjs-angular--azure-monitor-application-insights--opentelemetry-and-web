import { Router } from '@angular/router';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';

export class ApplicationInsightsUtils {
  private static _client: ApplicationInsights | undefined;

  public static set client(value: ApplicationInsights) {
    this._client = value;
  }

  public static get client(): ApplicationInsights | undefined {
    return this._client;
  }

  public static initialize(
    connectionString: string,
    router: Router,
    samplingRate = 1.0,
  ): void {
    const angularPlugin = new AngularPlugin();
    const appInsights = new ApplicationInsights({
      config: {
        samplingPercentage: samplingRate * 100,
        connectionString,
        // @ts-expect-error incompatible angularPlugin type
        extensions: [angularPlugin],
        extensionConfig: {
          [angularPlugin.identifier]: { router },
        },
      },
    });

    appInsights.loadAppInsights();
    appInsights.trackPageView();

    this.client = appInsights;
  }
}
