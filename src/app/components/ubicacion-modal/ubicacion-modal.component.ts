import { ToolsService } from './../../services/tools.service';
import { ModalController } from '@ionic/angular';
import { Component, ElementRef, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { Ubication } from 'src/app/interfaces/interfaces';
import { MapGeocoder } from '@angular/google-maps';

@Component({
  selector: 'app-ubicacion-modal',
  templateUrl: './ubicacion-modal.component.html',
  styleUrls: ['./ubicacion-modal.component.scss'],
})
export class UbicacionModalComponent implements OnInit {

  @ViewChild('map') googleMap: google.maps.Map;
  @ViewChild('content') contentRef: ElementRef;
  @ViewChild('searchBar') searchBar :HTMLIonSearchbarElement
  @Input('origin') origin : string

  public mapHeight:number
  public ubication:Ubication // remove
  public marker:google.maps.LatLngLiteral 
  public mapOptions: google.maps.MapOptions;
  public markerOptions: google.maps.MarkerOptions
  public autocompleteItems: google.maps.GeocoderResult[];
  public googleAutocomplete: google.maps.places.AutocompleteService;
  public addressSearch:string
  constructor(
    private ModalController:ModalController,
    private tools:ToolsService,
    private mapGeocoder: MapGeocoder
  ) { 
    this.autocompleteItems = []
  }


  ngOnInit() {
    try {
      navigator.geolocation.getCurrentPosition(
        (res)=>{
          this.mapOptions = {
            keyboardShortcuts: false,
            disableDefaultUI: true,
            center: { lat: res.coords.latitude, lng: res.coords.longitude },
            zoom: res.coords.accuracy,
          };
          this.markerOptions = { draggable: true }
          this.mapGeocode({location : { lat: res.coords.latitude, lng: res.coords.longitude } })
          
        },
        (err)=>{
          switch(err.code){
            case err.PERMISSION_DENIED:
              this.tools.showAlert({
                header: "Ubicacion bloqueada",
                cssClass:'alert-danger',
                subHeader: "Permiso denegado",
                message: "Los permisos para obtener la ubicacion y manejar el mapa, estan denegados por el usuario",
                buttons:[
                  'Aceptar'
                ]
              })
              break;
            case err.POSITION_UNAVAILABLE:
              this.tools.showAlert({
                header: "Posicion no disponible",
                subHeader: "Mapa no disponible",
                cssClass:'alert-warn',
                message: "Ha ocurrido algun problema con el dispositivo movil",
                buttons:[
                  'Aceptar'
                ]
              })
              break;
          }
          console.error(err);
          
        })
    } catch (error) {
      
    }
  }


  actualUbication(){
    this.onExit({
      location:this.marker,
      address:this.searchBar.value,
      origin:this.origin
    })    
  }

  centerMyUbication(){
    this.googleMap.panTo(this.marker);
  }

  onSearchChange(event:Event){
    this.mapGeocoder
    .geocode({address:(event as CustomEvent).detail.value})
    .subscribe(({results , status})=>{
      if (status == google.maps.GeocoderStatus.OK) {        
        this.autocompleteItems = results
      }
        if ( status == google.maps.GeocoderStatus.ERROR){
          console.error('error map geocoder');
        }
      })
  
  }

  selectAddress(result:google.maps.GeocoderResult){
    if(result.formatted_address != this.searchBar.value){
      this.autocompleteItems = []
      this.marker = result.geometry.location.toJSON()
      this.searchBar.value = result.formatted_address
      this.centerMyUbication()
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.mapGeocode({location:event.latLng.toJSON()})
  }

  dragendMarker(event){
    this.mapGeocode({location:event.latLng.toJSON()})
  }

  mapGeocode(request: google.maps.GeocoderRequest | any ){
    this.addressSearch = ''
    this.mapGeocoder.geocode(request)
      .subscribe(({ results, status }) => {
        if (status == google.maps.GeocoderStatus.OK) {        
          console.log(results);
          this.marker = {lat:request.location.lat, lng: request.location.lng}
          this.searchBar.value = results[0].formatted_address
        };
        if ( status == google.maps.GeocoderStatus.ERROR){
          console.error('error map geocoder');
        }
      },
      (error)=>{
        console.error(error);

      });
  }

  onExit(value?){
    this.ModalController.dismiss(value)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mapHeight = this.contentRef.nativeElement.offsetHeight;
  }

  ionViewDidEnter() {
    this.mapHeight = this.contentRef.nativeElement.offsetHeight;    
  }

}