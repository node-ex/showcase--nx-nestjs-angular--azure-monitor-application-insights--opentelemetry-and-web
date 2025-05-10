import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ApplicationInsightsUtils } from './application-insights.utils';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'app-angular-1';


  constructor() {
    const connectionString = process.env.PUBLIC_AZURE_MONITOR_APPLICATION_INSIGHTS_CONNECTION_STRING;
    /*
     * Setup based on the official documentation:
     * https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript-framework-extensions?tabs=angular
     */
    ApplicationInsightsUtils.initialize(connectionString);

    console.log('PUBLIC_GREETING', process.env.PUBLIC_GREETING);
  }
}
