import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn === true ? auth.isLoggedIn : router.navigateByUrl('/login');
}