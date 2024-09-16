import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([{ path: '', component: TodoComponent }]),
    provideHttpClient(),
  ],
  
};
