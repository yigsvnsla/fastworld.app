import { FormBuilder, FormGroup } from '@angular/forms';
import { ToolsService } from '../../services/tools.service';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FavoresModalFormComponent } from '../favores-modal-form/favores-modal-form.component';
import { Location } from '@angular/common';
import { FavoresModalMapComponent } from '../favores-modal-map/favores-modal-map.component';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-favores',
  templateUrl: './favores.component.html',
  styleUrls: ['./favores.component.scss'],
})
export class FavoresComponent implements OnInit {

  public listProducts:any[]
  
  public superMarkets : any[] = [
  'Mi comisariato',
  'Almacenes Tia',
  'Gran aki',
  'Supermaxi',
  'Coral',
  'Del portal',
  'Megakiwy'
  ] 

  public pharmacys : any[] = [
  'Distribuidora El trebol',
  'farmaceutica superior',
  'farmaceutica sebicar',
  'Farmacia Super Rebaja'
  ] 

  public formPurchase : FormGroup

  constructor(
    private formBuilder:FormBuilder,
    private tools:ToolsService,
    private location:Location
  ) { 
    this.listProducts = []
  }
  
  ngOnInit() {
    this.formPurchase = this.formBuilder.group({
      place:[''],
      client:[''],
      ubication:[''],
      typePurchase:[''],
      type:['']
    })
    
  }
  

  async genList(){
    if (this.listProducts.length < 8) {
      await this.tools.showAlert({
        header:'🚫 Alerta',
        cssClass: 'alert-danger',
        subHeader: 'Tu lista no esta lo suficientemente completa 😐',
        message:`Para generar una orden de compra, debe ser un minimo de 8 productos actualmente hay ${this.listProducts.length} en la lista`,
        buttons:['ok']
      })
    }else{
      await this.getLocaleDirection()
      .then(ubication=>{
        console.log({ubication,...this.listProducts});
        
      })
    }
  }

  async getLocaleDirection(){
    return new Promise((resolve, reject) => {
      try {
        navigator.geolocation.getCurrentPosition(
          (res) => {
            this.tools
              .showModal({
                component: FavoresModalMapComponent,
                cssClass: 'modal-fullscreen',
                backdropDismiss: false,
                componentProps: {
                  geolocationPosition: res
                },
              })
              .then(ubication=>{
                if ( ubication != null) {
                  resolve(ubication)
                  console.log(ubication);
                }
              })
          },
          (err) => {
            switch (err.code) {
              case err.PERMISSION_DENIED:
                this.tools.showAlert({
                  header: "Ubicacion bloqueada",
                  cssClass: 'alert-danger',
                  subHeader: "Permiso denegado",
                  message: "Los permisos para obtener la ubicacion y manejar el mapa, estan denegados por el usuario",
                  buttons: ['Aceptar']
                })
                break;
              case err.POSITION_UNAVAILABLE:
                this.tools.showAlert({
                  header: "Posicion no disponible",
                  subHeader: "Mapa no disponible",
                  cssClass: 'alert-warn',
                  message: "Ha ocurrido algun problema con el dispositivo movil",
                  buttons: ['Aceptar']
                })
                break;
            }
            this.location.back()
            reject(err)
          })
      } catch (error) {
        reject(error.message)
      }
    })
  }

  async deleteItem(index){
    await this.tools.showAlert({
      header:'🚫 Alerta',
      cssClass: 'alert-danger',
      subHeader: `Esta a apunto de eliminar ${this.listProducts[index].name} de la lista 😐`,
      buttons:[{
        text:'Cancelar'
      },{
        text:'Eliminar',
        handler: ()=>{
          this.listProducts.splice(index)
        }
      }]
    })
  }

  async addProduct(index? : number){
    this.tools.showModal({
      component:FavoresModalFormComponent,
      cssClass:'modal-fullscreen',
      componentProps:{
        Item: this.listProducts[index]
      }
    })
      .then(item=>{        
        if ( item != null ){
          if (this.listProducts.find(i => i.name == item.name) != undefined ) {
            if(this.tools.compareObjets(this.listProducts[this.listProducts.findIndex(i => i.name == (this.listProducts.find(i => i.name == item.name)).name )],item)){
              this.listProducts[this.listProducts.findIndex(i => i.name == (this.listProducts.find(i => i.name == item.name)).name )] = item
            }else{
              console.error('este elemento no fue modificado');
            }
          }else{
            this.listProducts.push(item)            
          }
        }        
      })
  }

}

