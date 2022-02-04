import { CookiesService } from './../services/cookies.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoloadGuard implements CanActivate {

  constructor(
    private localStorageService:LocalStorageService,
    private router:Router,
    private cookieService:CookiesService
  ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      return new Promise<boolean>((resolve, reject) => {
        this.localStorageService.check(environment.cookieTag)
          .then(check=>{
            if( check  && this.cookieService.check(environment.cookieTag)){
              this.localStorageService.get(environment.cookieTag)
              .then(user=>{
                  this.router.navigateByUrl(`menu/${user.role}`)
                  reject(false)
                })
              }else{
                resolve(true)
            }
          })
      })
  }
  
}
