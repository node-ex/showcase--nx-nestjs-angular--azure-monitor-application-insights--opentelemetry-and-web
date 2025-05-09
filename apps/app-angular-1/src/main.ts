/* Must be the imported before other imports */
import './app/application-insights.setup';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err: unknown) => {
  console.error(err);
});
