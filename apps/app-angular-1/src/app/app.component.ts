import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ApplicationInsightsUtils } from './application-insights.utils';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'app-angular-1';

  constructor(private router: Router) {
    const connectionString =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.PUBLIC_AZURE_MONITOR_APPLICATION_INSIGHTS_CONNECTION_STRING!;
    const samplingRate = process.env
      .PUBLIC_AZURE_MONITOR_APPLICATION_INSIGHTS_SAMPLING_RATE
      ? Number(
          process.env.PUBLIC_AZURE_MONITOR_APPLICATION_INSIGHTS_SAMPLING_RATE,
        )
      : undefined;

    /*
     * Setup based on the official documentation:
     * https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript-framework-extensions?tabs=angular
     * https://github.com/microsoft/applicationinsights-angularplugin-js
     */
    if (connectionString) {
      ApplicationInsightsUtils.initialize(
        connectionString,
        this.router,
        samplingRate,
      );
    }

    console.log('PUBLIC_GREETING', process.env.PUBLIC_GREETING);

    ApplicationInsightsUtils.client?.trackEvent({
      name: 'AppComponent loaded event',
      properties: {
        isEvent: true,
      },
    });
    ApplicationInsightsUtils.client?.trackTrace({
      message: 'AppComponent loaded trace',
      severityLevel: SeverityLevel.Information,
      properties: {
        isTrace: true,
      },
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getDataApi();
    try {
      await this.throwExceptionApi();
    } catch (error) {
      throw new Error('Rethrown error');
    }

    throw new Error('Test unhandled error');
  }

  async getDataApi(): Promise<void> {
    const response = await fetch('/api');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();
    console.log('data', data);
  }

  async throwExceptionApi(): Promise<void> {
    await fetch('/api/exception', {
      method: 'POST',
    });
  }
}
