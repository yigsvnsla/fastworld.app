import { ToolsService } from 'src/app/services/tools.service';
import { ConectionsService } from 'src/app/services/conections.service';
import { Component, OnInit } from '@angular/core';
import { MapDirectionsService, MapGeocoder, MapGeocoderResponse } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { Products, Ubication, User } from 'src/app/interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dinamic-validate',
  templateUrl: './dinamic-validate.page.html',
  styleUrls: ['./dinamic-validate.page.scss'],
})
export class DinamicValidatePage implements OnInit {

  template = true

  public position: Ubication;

  public package: any

  constructor(
    private activeRoute: ActivatedRoute,
    private conections: ConectionsService,
    private mapGeocoder: MapGeocoder,
    public tools: ToolsService,
    public mapDirectionsService: MapDirectionsService
  ) {

    this.package = {
      name: '',
      phone: ''
    }

  }

  addDesc(event) {
    this.position.indications = event.detail.value
  }

  ngOnInit() {

    this.position = {
      address: '',
      indications: '',
    }

    this.conections
      .guest({ token: this.activeRoute.snapshot.paramMap.get('token') })
      .then(response => {
        this.package = response
      });



  }

  async onClick() {
    this.template = false
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
              destination: this.package.package.location.start.location, // tomar ubicacion desde el response del guest
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.METRIC
            })
            .subscribe(({ result, status }) => {
              if (status == google.maps.DirectionsStatus.OK) {
                if (typeof this.package.client.membership == 'string') {
                  // si el cliente no tiene membrecia,
                  //tomar la ubicacion de inicio desde la variable global y proceder hacer el calculo
                  this.conections
                  .guest({ 
                    token: this.activeRoute.snapshot.paramMap.get('token'), 
                    location: this.position, 
                    price_route: (Math.round(Number(result.routes[0].legs[0].distance.text.replace(/km/, '').replace(/,/, '.').trim())) * environment.formuleConst.kilometraje + environment.formuleConst.arranque).toString(),
                    distance: result.routes[0].legs[0].distance.text 
                  })
                }

                if ( typeof this.package.client.membership == 'object'){
                  this.conections
                  .guest({ 
                    token: this.activeRoute.snapshot.paramMap.get('token'), 
                    location: this.position, 
                    distance: result.routes[0].legs[0].distance.text 
                  })
                }
              }
            })
        
      })
  }

  private currentPosition() {
    return new Promise<google.maps.GeocoderResult>((resolve, reject) => {
      this.tools.showLoading()
        .then(loading => {
          navigator.geolocation.getCurrentPosition(
            async res => resolve(await this.geoDecode({ location: { lat: res.coords['latitude'], lng: res.coords['longitude'] } }).finally(() => loading.dismiss())),
            err => reject(err)
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