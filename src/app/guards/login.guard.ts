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
    private cookieService:CookiesService,
    private router:Router,
    private localStorage:LocalStorageService
  ){

    }

  canActivate(  route: ActivatedRouteSnapshot,  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let check = async ()=>{
      return await this.localStorage.check(environment.cookieTag)
    }

      if(this.cookieService.check(environment.cookieTag) && check){
        return true
      }else{
        this.router.navigateByUrl('auth')
        return false
      }
  
  }
  
}
