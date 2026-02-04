import { Routes } from "@angular/router";
import { guestGuard } from "./infrastructure/guards/auth.guard";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    },
    /** Login page - only accessible by guests */
    {
        path: 'login',
        loadComponent: () => import('./modules/auth/pages/login/login.component')
            .then(m => m.LoginComponent),
        canActivate: [guestGuard]
    },
    {
        path: "home",
        loadComponent: () => import("./modules/example-page/example-page.component").then((m) => m.ExamplePageComponent)

    },
    /** Redirect unknown paths to login */
    {
        path: '**',
        redirectTo: '/login'
    }
];
