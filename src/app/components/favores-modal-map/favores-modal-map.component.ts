import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolsService } from './../../services/tools.service';
import { ModalController } from '@ionic/angular';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MapGeocoder } from '@angular/google-maps';

@Component({
  selector: 'app-favores-modal-map',
  templateUrl: './favores-modal-map.component.html',
  styleUrls: ['./favores-modal-map.component.scss'],
})
export class FavoresModalMapComponent implements OnInit {
  @ViewChild('map') googleMap: google.maps.Map;
  @ViewChild('searchBar') searchBar: HTMLIonSearchbarElement
  @Input() geolocationPosition: GeolocationPosition

  public mapOptions: google.maps.MapOptions;
  public marker: google.maps.LatLngLiteral
  public markerOptions: google.maps.MarkerOptions
  public autocompleteItems: google.maps.GeocoderResult[];
  public formLocation : FormGroup
  constructor(
    private formBuilder:FormBuilder,
    private mapGeocoder: MapGeocoder,
    private modalController:ModalController,
    private tools:ToolsService
  ) {
    this.formLocation = this.formBuilder.group({
      location: [''],
      address: [''],
      indications:this.formBuilder.group({
        reference:[''],
        indication:['']
      })
    });
  }

  ngOnInit() {
    this.mapOptions = {
      keyboardShortcuts: false,
      disableDefaultUI: true,
      center: { lat: this.geolocationPosition.coords.latitude, lng: this.geolocationPosition.coords.longitude },
    };
    this.markerOptions = { draggable: true };
    this.mapGeocode({ location: { lat: this.geolocationPosition.coords.latitude, lng: this.geolocationPosition.coords.longitude } });

  }

  ionViewDidEnter() {
    this.formLocation = this.formBuilder.group({
      location: [this.marker],
      address: [this.searchBar.value],
      indications:this.formBuilder.group({
        reference:['',[Validators.required]],
        indication:['',[Validators.required]]
      })
    });
  }

  
  onExit(data = null){
    this.modalController.dismiss(data)
  }

  actualUbication() {
    this.onExit(this.formLocation.value)
  }

  centerMyUbication() {
    this.googleMap.panTo(this.marker);
  }


  addMarker(event: google.maps.MapMouseEvent) {
    this.mapGeocode({ location: event.latLng.toJSON() })
  }

  dragendMarker(event) {
    this.mapGeocode({ location: event.latLng.toJSON() })
  }

  mapGeocode(request: google.maps.GeocoderRequest | any) {
    this.mapGeocoder.geocode(request)
      .subscribe(({ results, status }) => {
        if (status == google.maps.GeocoderStatus.OK) {
          this.marker = { lat: request.location.lat, lng: request.location.lng }
          this.searchBar.value = results[0].formatted_address;
        };
        if (status == google.maps.GeocoderStatus.ERROR) {
          console.error('error map geocoder');
        }
      },
      (error) => {
        console.error(error);

      });
  }

  private debounceTimer
  onSearchChange(address: string) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      if (address != '') {
        this.mapGeocoder
          .geocode({ address })
          .subscribe(({ results, status }) => {
            switch (status) {
              case google.maps.GeocoderStatus.OK:
                this.autocompleteItems = results
                if (this.autocompleteItems.length == 1) this.selectAddress(this.autocompleteItems[0])
                console.log(results);
                break;
              case google.maps.GeocoderStatus.ERROR:
                console.error('error map geocoder');
                break;
              case google.maps.GeocoderStatus.ZERO_RESULTS:
                this.searchBar.value = ""
                this.autocompleteItems = []
                this.tools.showAlert({
                  header: 'Sin Resultados 🤷‍♂️',
                  subHeader: 'Es posible que la direccion no exista o este mal escrita',
                  cssClass: 'alert-warn',
                  buttons: ['ok']
                })
                break;
            }
          })
      }
    }, 5000);
  }

  firstSelect() {
    if (this.autocompleteItems.length == 1) this.selectAddress(this.autocompleteItems[0])
  }

  selectAddress(result: google.maps.GeocoderResult) {
    if (result.formatted_address != this.searchBar.value) {
      this.autocompleteItems = []
      this.marker = result.geometry.location.toJSON()
      this.searchBar.value = result.formatted_address
      this.centerMyUbication()
    }
  }

}

/*
  

*/