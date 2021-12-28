import { ToolsService } from './../../services/tools.service';
import { environment } from './../../../environments/environment';
import { LocalStorageService } from './../../services/local-storage.service';
import { ConectionsService } from './../../services/conections.service';
import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/interfaces/interfaces';
import { HistorialModalComponent } from '../historial-modal/historial-modal.component';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit {

  public list : Products[]

  constructor(
    private conection:ConectionsService,
    private localStorage:LocalStorageService,
    private tools: ToolsService
  ) { 
    this.list = []
  }

  async ngOnInit( ) {
    this.load((await this.localStorage.get(environment.cookieTag)).role)
  }

  async openModal(item:Products){
    this.tools.showModal({
      component:HistorialModalComponent,
      backdropDismiss:false,
      keyboardClose:true,
      componentProps:{
        data:item,
        role:(await this.localStorage.get(environment.cookieTag)).role
      }
    })
  }

  async load(role:string){
    switch (role) {
      case 'cliente':
        this.list = await this.conection.get(`products?client.email_eq=${(await this.localStorage.get(environment.cookieTag)).email}`)
        break;
      case 'conductor':
        this.list = await this.conection.get(`products?driver_eq=${(await this.localStorage.get(environment.cookieTag)).email}`)
        break;
      default:
        console.error('no role');
        break;
    }
  }

  async doRefresh(event : Event){
    await this.load((await this.localStorage.get(environment.cookieTag)).role)
      .then(()=>{
        (event as CustomEvent).detail.complete()
      })
  } 


  formatPrice(value: number | string){
    return formatCurrency( typeof value == 'string' ? Number(value) : value, 'en-us', '$')
  }
}
