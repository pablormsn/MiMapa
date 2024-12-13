import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthGoogleService } from "./auth-google.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  authService = inject(AuthGoogleService);
  constructor(private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // El token es válido, se permite el acceso.
    } else {
      this.router.navigate(["/login"]); // Redirige si no está autenticado.
      return false;
    }
  }
}
