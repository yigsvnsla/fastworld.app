import { FormBuilder, FormGroup } from '@angular/forms';
import { ToolsService } from '../../services/tools.service';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FavoresModalFormComponent } from '../favores-modal-form/favores-modal-form.component';
import { getLocaleDirection, Location } from '@angular/common';
import { FavoresModalMapComponent } from '../favores-modal-map/favores-modal-map.component';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-favores',
  templateUrl: './favores.component.html',
  styleUrls: ['./favores.component.scss'],
})
export class FavoresComponent implements OnInit {

  public listProducts:any[]
  


 // fix list scroll <item-group>

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

  ionViewDidEnter() {

  }

  @ViewChild('inputTypePurchase') inputTypePurchase: HTMLIonInputElement
  @ViewChild('formCompras') formCompras : ElementRef

  public scrollHeigth : number = 0

  ngAfterViewChecked() {

    
    
    if(this.formPurchase.get('type').value != ''){
      console.log(this.scrollHeigth)
      // setTimeout(() => {
        // console.log(this.inputTypePurchase);
        // console.log(this.formCompras.nativeElement);
        // console.log(this.formCompras);
        // }, 100);
        
        
    }
    
    
  }
  
  setType(event:Event){
    
    this.scrollHeigth = this.formCompras.nativeElement.offsetHeight;
    console.log(this.formCompras)

    if ((event as CustomEvent).detail.value != 'otros'){
      this.formPurchase.get('typePurchase').setValue((event as CustomEvent).detail.value )
    }else{
      
      this.formPurchase.get('typePurchase').reset()
      this.formPurchase.get('place').reset()


    }
    window.focus()
  }

  async genList(){

    console.log(this.formPurchase.value);


    // if (this.listProducts.length < 8) {
    //   await this.tools.showAlert({
    //     header:'🚫 Alerta',
    //     cssClass: 'alert-danger',
    //     subHeader: 'Tu lista no esta lo suficientemente completa 😐',
    //     message:`Para generar una orden de compra, debe ser un minimo de 8 productos actualmente hay ${this.listProducts.length} en la lista`,
    //     buttons:['ok']
    //   })
    // }else{
    //   await this.getLocaleDirection()
    //   .then(ubication=>{
    //     console.log({ubication,...this.listProducts});
        
    //   })
    // }
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

  async addProduct(){
    this.tools.showModal({
      component:FavoresModalFormComponent,
      cssClass:'modal-fullscreen'
    })
      .then(e=>{
        if ( e != null){
          this.listProducts.push(e)
        }
        console.log(this.listProducts);
        
      })
  }

  intanceFormPurshace(){

  }

}

