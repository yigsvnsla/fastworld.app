import { IonInput, IonItem } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToolsService } from 'src/app/services/tools.service';
import { ConectionsService } from 'src/app/services/conections.service';
import { Component, OnInit } from '@angular/core';
import { MapDirectionsService, MapGeocoder, MapGeocoderResponse } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { Products, Ubication, User } from 'src/app/interfaces/interfaces';
import { environment } from 'src/environments/environment';
import { format, isValidPhoneNumber } from 'libphonenumber-js';

@Component({
  selector: 'app-dinamic-validate',
  templateUrl: './dinamic-validate.page.html',
  styleUrls: ['./dinamic-validate.page.scss'],
})
export class DinamicValidatePage implements OnInit {

  template = true

  public position: Ubication;

  public package: any
  public isLoad: boolean
  public form : FormGroup
  constructor(
    private activeRoute: ActivatedRoute,
    private conections: ConectionsService,
    private mapGeocoder: MapGeocoder,
    public tools: ToolsService,
    public mapDirectionsService: MapDirectionsService,
  ) {
    this.isLoad = false
  }

  addDesc(event) {
    this.position.indications = event.detail.value
  }

  async ngOnInit() {

    this.package = {
      name: '',
      phone: ''
    }

    this.position = {
      address: '',
      indications: '',
    }

    this.conections
      .guest({ token: this.activeRoute.snapshot.paramMap.get('token') })
      .then( async response => {        
        if(response.status == 500){
          this.tools.showAlert({
            header:'Al parecer tu ticket ya caduco 🕔',
            cssClass:'alert-danger',
            subHeader:'las tickets de confirmacion tienen una duracion en promedio de 2 horas de vida, comuniquese con su proveedor para adquirir una nueva validacion',
            backdropDismiss:false
          })
        }else{
          console.log(response);
          
          this.conections.get(`regions?id=${response['client'].region}`)
            .then(res=>{
              response.client.region = res[0]
              this.package = {
                product:response['product'], 
                client:response['client'],
                name: response.product['user_name'], 
                phone: response.product['user_phone'], 
              }
              this.isLoad = true
              
            })
        }
      });

    await this.currentPosition()
  }

  async onClick() {
    this.currentPosition()
      .then(result => {
        this.position.location = result.geometry.location.toJSON()
        this.position.address = result.formatted_address
        return result
      })
      .then(result => {
          this.mapDirectionsService
            .route({
              origin: result.geometry.location,
              destination: this.package.product.location.start.location, // tomar ubicacion desde el response del guest
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.METRIC
            })
            .subscribe(async ({ result, status }) => {
              if (status == google.maps.DirectionsStatus.OK) {
                if (this.package.client.memberships === null) {                  
                  // si el cliente no tiene membrecia,
                  //tomar la ubicacion de inicio desde la variable global y proceder hacer el calculo
                  await this.conections
                    .guest({ 
                      token: this.activeRoute.snapshot.paramMap.get('token'), 
                      location: this.position, 
                      price_route: (Math.round(Number(result.routes[0].legs[0].distance.text.replace(/km/, '').replace(/,/, '.').trim())) * this.package.client.region.price_start + this.package.client.region.price_base).toString(),
                      distance: result.routes[0].legs[0].distance.text,
                      user_phone: this.package.phone,
                      user_name:this.package.name
                    })
                  this.template = false
                }
                if ( this.package.client.memberships !== null){                  
                  await this.conections
                    .guest({ 
                      token: this.activeRoute.snapshot.paramMap.get('token'), 
                      location: this.position, 
                      distance: result.routes[0].legs[0].distance.text,
                      user_phone: this.package.phone,
                      user_name:this.package.name
                    })
                    this.template = false
                }
              }
            })
      })
  }

  changeFormatName(itemName: IonItem,nameInput:IonInput){
    if (nameInput.value == null) itemName.color = 'danger'
    if (nameInput.value == '') itemName.color = 'danger'
    if (nameInput.value != ''  && (nameInput.value as string).match(/([a-zA-z])/g)) {
      itemName.color = 'success'
      this.package.name = nameInput.value;
    }else{
      return itemName.color = 'danger'
    }
  }

  changeFormatPhone(itemPhone: IonItem,phoneInput:IonInput){    
    if (phoneInput.value == null) itemPhone.color = 'danger'
    if (phoneInput.value == '') itemPhone.color = 'danger';
    if (phoneInput.value != '' && phoneInput.value != null) {
      if((phoneInput.value as string).match(/([0-9])/g)){
        if ((phoneInput.value as string).match(/ /g)){
          this.package.phone = (phoneInput.value as string).replace(/ /g, '')
          itemPhone.color = ''  
        }   
        if ((phoneInput.value as string).match(/^\+/) != null){
          if (isValidPhoneNumber((phoneInput.value as string))){
           itemPhone.color = 'success'  
            this.package.phone = phoneInput.value
          }else{
            itemPhone.color = 'danger'
          }
      
        }  
        if (RegExp(/[0-9]/g).test((phoneInput.value as string)) && (phoneInput.value as string).length == 10 ) {
          this.package.phone = phoneInput.value
          itemPhone.color = 'success'
        }else{
          itemPhone.color = 'danger';

        }
         
      }
    }
  }

  postFormatPhone(phone:string|number, input :IonInput) {
    if (RegExp(/[0-9]/g).test(phone.toString()) && phone.toString().length == 10) {
      this.package.phone =  format(phone.toString(), 'EC', 'INTERNATIONAL').replace(/ /g, '') 
    }
  }

  validation(){
    if ((this.package.phone != null && this.package.phone != '') && (this.package.name != null && this.package.name != '' ) ) {
      if (isValidPhoneNumber((this.package.phone  as string)) && (this.package.name != ''  &&  this.package.name.match(/([a-zA-z])/g)  ))   return true
      else return false 
    }
    else return false
  }

  private currentPosition() {
    return new Promise<google.maps.GeocoderResult>((resolve, reject) => {
      this.tools.showLoading()
        .then(loading => {
          navigator.geolocation.getCurrentPosition(
            async res => resolve(await this.geoDecode({ location: { lat: res.coords['latitude'], lng: res.coords['longitude'] } }).finally(() => loading.dismiss())),
            async err => reject(err)
          );
        })
    })
  }

  private geoDecode(request: google.maps.GeocoderRequest) {
    return new Promise<google.maps.GeocoderResult>((value, reject) => {
      this.mapGeocoder.geocode(request)
        .subscribe(({ results, status }) => {
          if (status == google.maps.GeocoderStatus.OK) {
            value(results[0]);
          } else {
            reject('No se pudo obtener la localizacion');
          }
        });
    });
  }
}

interface Package {
  client?: User,
  name: string,
  phone: string,
  package?: Products
}