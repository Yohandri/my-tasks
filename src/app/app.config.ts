import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./infrastructure/interceptors/auth.interceptor";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptors([authInterceptor])),
        importProvidersFrom(BrowserAnimationsModule)
    ]
};
