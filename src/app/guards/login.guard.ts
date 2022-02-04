import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookiesService } from '../services/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private cookieService: CookiesService,
    private router: Router,
    private localStorage: LocalStorageService,
    private CookiesService: CookiesService
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise<boolean>(async (resolve, reject) => {
      this.localStorage.check(environment.cookieTag)
        .then(check => {
          if (this.cookieService.check(environment.cookieTag) && check) {
            resolve(true)
          } else {
            this.CookiesService.remove(environment.cookieTag);
            this.router.navigateByUrl('auth')
            reject(false)
          }
        })
    })
  }

}
