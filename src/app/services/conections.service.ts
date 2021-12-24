import { LocalStorageService } from './local-storage.service';
import { ToolsService } from './tools.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CookiesService } from './cookies.service';
import { Router } from '@angular/router';
import { Auth, User } from '../interfaces/interfaces'
import { Socket } from 'ngx-socket-io';
import { fromEvent, interval, merge, Observable, Observer} from 'rxjs';
import { first, map, retry } from "rxjs/operators";
import { OffLineModalComponent } from '../components/off-line-modal/off-line-modal.component';
@Injectable({
  providedIn: 'root'
})
export class ConectionsService {

  constructor(
    private socket: Socket,
    private httpClient:HttpClient,
    private cookie : CookiesService,
    private toolsService:ToolsService,
    private localStorageService:LocalStorageService,
    private router:Router,
  ) {

  }

  headers = async (content?: any)=>{    
    return {
      'Content-Type': content ? content : 'application/json',
      'Authorization': `Bearer ${this.cookie.get(environment.cookieTag)}`
    }
  }


  //Metodos basicos para cualquier consulta http

  async get(path: string) {
    return new Promise<any>((resolve, reject) => {
      this.toolsService.showLoading()
        .then(async loading=>{
          this.httpClient.get<any>(`${environment.api}/${path}`, {
            headers: await this.headers(),
          })
            .toPromise()
            .then(res=>{
              resolve(res)
            })
            .catch(error=>{
              reject(error)
              console.error('conectionService',error)
            })
            .finally(()=>{
              loading.dismiss()
            })
        })
    })
  }

  async post(path: string, data:any) {
    return new Promise<any>((resolve, reject) => {
      this.toolsService.showLoading()
        .then(async loading=>{
          this.httpClient.post(`${environment.api}/${path}`, data, {headers: await this.headers()})
            .toPromise()
            .then(res=>{
              resolve(res)
            })
            .catch(error=>{
              reject(error)
              console.error('conectionService',error)
            })
            .finally(()=>{
              loading.dismiss()
            })
        })
    })
  }

  async put(path: string, data) {
    return <any>this.httpClient.put(`${environment.api}/${path}`, data, {headers: await this.headers()}).toPromise();
  }

  async delete(path: string) {
    return new Promise<any>((resolve, reject) => {
      this.toolsService.showLoading()
        .then(async loading=>{
          this.httpClient.delete<any>(`${environment.api}/${path}`, { headers: await this.headers() })
            .toPromise()
            .then(res=>{
              resolve(res)
            })
            .catch(error=>{
              reject(error)
              console.error('conectionService',error)
            })
            .finally(()=>{
              loading.dismiss()
            })
        })
    })
  }

  async auth(data:any) {
      this.toolsService.showLoading()
        .then(alert=>{
          this.httpClient.post<Auth>(`${environment.api}/clients/auth`, data)
            .toPromise()
            .then(async (res)=>{
              if (res.status == '404'){
                this.toolsService.showAlert({
                  header:'Correo o Contraseña Invalidos 🚫',
                  subHeader:`Error ${res['status']}`,
                  cssClass:'alert-danger',
                  buttons:[
                    {
                      text:'ok',
                      role:'success'
                    }
                  ]
                })
              } else if (res.status == '1005') {
                this.toolsService.showAlert({
                  header:'En Proceso 🕔',
                  subHeader:`Estan verificado tu cuenta`,
                  cssClass:'alert-warn',
                  buttons:[
                    {
                      text:'ok',
                      role:'success'
                    }
                  ]
                })
              } else if (res.status == '1006') {
                this.toolsService.showAlert({
                  header:'Bloqueado 🚫',
                  subHeader:`Has sido reportado, por favor comunicate con nosotros`,
                  cssClass:'alert-danger',
                  buttons:[
                    {
                      text:'ok',
                      role:'success'
                    }
                  ]
                })
              } else if (res.status == '1015') {
              } else {
                this.cookie.set(environment.cookieTag, { jwt: res.jwt, email:res.email });
                this.httpClient.get<User>(`${environment.api}/clients/${res.email}`, {headers: await this.headers()})
                  .toPromise()
                  .then((data)=>{                    
                    this.localStorageService
                      .set(environment.cookieTag, data)
                      .then(()=>{
                        this.router.navigateByUrl(`/menu/${data.role}`)
                      });
                    
                  })
              }
            })
            .finally(()=>{
              alert.dismiss()
            })
    })
  
  }

  async logOut() {
    this.socket.emit('quit', { email: (await this.localStorageService.get(environment.cookieTag)).email});
    await this.localStorageService.remove(environment.cookieTag);
    this.cookie.remove(environment.cookieTag);
    this.socket.disconnect();
    this.router.navigateByUrl('auth');
  }

  

  async guest(data:{token:string,request?:any}) {
    return new Promise<any>((resolve, reject) => {
      this.toolsService.showLoading()
        .then(async loading=>{
          this.httpClient.post(`${environment.api}/products/guest`, data)
            .toPromise()
            .then(res=>{
              resolve(res)
            })
            .catch(error=>{
              reject(error)
              console.error('conectionService',error)
            })
            .finally(()=>{
              loading.dismiss()
            })
        })
    })
    // return <any>this.httpClient.post(`${environment.api}/products/guest`, data).toPromise();
  }

  //TEMPORAL POST GUEST
  async guestPost(path, data){
    return <any>this.httpClient.post(`${environment.api}/${path}`, data).toPromise();
  }

  isOnline(){
    this.getWindowInternet()
      .subscribe(async net=>{
        if(net){
          console.log('dispositivo fisico conectado a internet');
          // mejorar deteccion de estado de conexion a internet 

              // this.httpClient.get<any>(`${environment.api}/products`, {
              //   headers: await this.headers(),
              //   observe:'response',
              // })
              //   .pipe(
              //     retry(3),
              //     first()
              //   )
              //   .subscribe(
              //     response=>{
              //       switch (response.status) {
              //         case 200:
              //           console.log('servidor encendido');
              //           console.log(response.status); 
                                                    
              //           break;
              //         case 404:
              //           console.error('404 not found');
              //           console.log(response.status); 
              //           break
              //         default:
              //           break;
              //       }
              //     },
              //     err=>{
              //       console.error('error ping',err);
              //       // console.log(err.status); 

              //     }
              //   )

        }else{
          console.log('dispositivo fisico sin internet');
          await this.toolsService.showModal({
            component: OffLineModalComponent,
            keyboardClose: true,
          });
        }
      })
  }

  private getWindowInternet() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

}


