import { ConectionsService } from './../../services/conections.service';
import { ShareUrlModalComponent } from './../share-url-modal/share-url-modal.component';
import { UbicacionModalComponent } from './../ubicacion-modal/ubicacion-modal.component';
import { environment } from './../../../environments/environment';
import { LocalStorageService } from './../../services/local-storage.service';
import { ToolsService } from './../../services/tools.service';
import { add, parseISO } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { formatCurrency, Location } from '@angular/common';
import { Memberships } from 'src/app/interfaces/interfaces';
import { MapDirectionsService } from '@angular/google-maps';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generar-encomienda',
  templateUrl: './generar-encomienda.component.html',
  styleUrls: ['./generar-encomienda.component.scss'],
})
export class GenerarEncomiendaComponent implements OnInit {

  @ViewChild('dateTime') dateTime: IonDatetime;

  public add = add;

  public timeNow: Date;
  public formPackage: FormGroup;
  public categoryList: any[];
  public timeOutList: any[];
  public formattedAmount: string;
  public memberships: Memberships | string;

  public kilometerRef
  constructor(
    public tools: ToolsService,
    private formBuilder: FormBuilder,
    private localStorage: LocalStorageService,
    private mapDirectionsService: MapDirectionsService,
    private conection: ConectionsService,
    private router:Router
  ) {

    this.categoryList = [
      'Alimentos',
      'Correspondencia',
      'Llaves',
      'Libros',
      'Licor',
      'Otros',
      'Ropa',
      'Tecnología',
    ]
    this.timeOutList = [30, 45, 60]
    this.timeNow = new Date(Date.now())

  }

  async ngOnInit() {

    this.instance()

    console.log(this.tools.typeOf(this.memberships,'object'));
  }

  ionViewWillEnter() {

    

    this.instance()  
  }

  async onSubmit(form: FormGroup) {
    await this.conection.post('products', form.value).then(Response=> console.log(Response))
    await this.router.navigateByUrl('/menu/cliente/mis-encomiendas')
  }

  async dateTimeChange(event: Event) {
    // si la fecha actual es menor a 1 hora con 30  minutos, disparar una alerta, en caso contrario asignar valor a el formControl "timeOut"
    if (new Date(Date.now()) < this.add(parseISO((event as CustomEvent).detail.value), { hours: 1, minutes: 30 })) {
      this.formPackage
        .get('timeout')
        .setValue((event as CustomEvent).detail.value)
    } else {
      await this.tools.showAlert({
        backdropDismiss: false,
        header: 'Alerta ⚠',
        cssClass: 'alert-warn',
        subHeader: 'La fecha de entrega programada tiene que ser mayor a 1 hora y 30 minutos para ser registrada',
        buttons: [
          {
            text: 'ok',
            role: 'success',
            handler: () => {
              // reset ion-datetime
              this.dateTime.reset();
              // al estar enlazado a el formControl establecemos de nuevo el valor del control
              this.formPackage
                .get('timeout')
                .setValue(new Date(Date.now()).toISOString())
            }
          },
        ],
      });
    }
  }

  genTicket() {
    if (this.formPackage.valid) {
      this.tools.showAlert({
        backdropDismiss: false,
        header: 'Alerta ⚠',
        cssClass:'alert-warn',
        subHeader: 'A continuacion va a generar una encomienda.',
        message: 'Solo use esta opcion en caso de no saber la ubicacion de su cliente',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Continuar',
            role: 'success',
            handler: async () => {
              console.log(this.formPackage.value);

              this.conection
                .post('products', this.formPackage.value)
                .then(response => {
                  console.log(response);
                  this.tools
                    .showModal({
                      component: ShareUrlModalComponent,
                      backdropDismiss: false,
                      componentProps: {
                        url:`https://fastworld.app/encomienda/${response['id']}`
                      },
                    })
                })
            },
          },
        ],
      });
    } else {
      this.tools.showAlert({
        header: 'Alerta ⚠',
        cssClass: 'alert-warn',
        subHeader: 'Por favor completar los datos de envio',
        buttons: [
          {
            text: 'OK',
            role: 'success',
          },
        ],
      });
    }
  }

  setUbication(origin: 'start' | 'goal') {
    this.tools.showModal({
      component: UbicacionModalComponent,
      cssClass: 'ubication-modal',
      backdropDismiss: false,
      componentProps: {
        origin: origin
      }
    })
      .then(data => {
        if (data) {
          switch (origin) {
            case 'goal':
              if(!(this.formPackage.get('location') as FormGroup).value.hasOwnProperty('goal')){
                (this.formPackage.get('location') as FormGroup)
                  .addControl('goal', this.formBuilder.group({
                    address: ['', []],
                    location: [null, []],
                    indications: ['']
                  }))
              }
              this.formPackage.controls.location
                .get(data.origin).patchValue({
                  address: data.address,
                  location: data.location
                })
              this.mapDirectionsService
                .route({
                  origin: this.formPackage.controls.location.get('start').get('location').value,
                  destination: this.formPackage.controls.location.get('goal').get('location').value,
                  travelMode: google.maps.TravelMode.DRIVING,
                  unitSystem: google.maps.UnitSystem.METRIC
                })
                .subscribe(({ result, status }) => {
                  if (status == google.maps.DirectionsStatus.OK) {
                    this.kilometerRef = result.routes[0].legs[0].distance.text
                    this.formPackage
                      .get('distance')
                      .setValue(result.routes[0].legs[0].distance.text)

                      if (this.memberships == null){
                        this.formPackage
                          .get('price_route') // cambiar el input de strapi para que acepte numeros, y no una cadena de texto
                          .setValue((Math.round(Number(result.routes[0].legs[0].distance.text.replace(/km/, '').replace(/,/, '.').trim())) * environment.formuleConst.kilometraje + environment.formuleConst.arranque).toString())
                      } 
                        
                  }
                })
              break;
            case 'start':
              this.formPackage.controls.location
                .get(data.origin).patchValue({
                  address: data.address,
                  location: data.location
                })
              break;
            default:
                console.error('origin not found');
              break;
          }
        }
      })
  }

  eventPriceFocus(event) {
    event.target.value = null;
  }

  eventPriceBlur(event) {
    this.formPackage
      .get('price')
      .setValue(Number(event.target.value))

    this.formattedAmount = formatCurrency(parseFloat(event.target.value.trim()), 'en-US', '$');
  }

  addDesc(event: Event, origin: string) {
    this.formPackage.controls.location
      .get(origin).patchValue({
        indications: (event as CustomEvent).detail.value
      })
  }

   private async instance(){
        // Creando instancia de el formulario de la encomienda
        this.formPackage = this.formBuilder.group({
          type: ['', [Validators.required]],
          price: [0, [Validators.required]],
          timeout: ['', [Validators.required]],
          // ajustar patron regex para validar el input "UserName" Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g)
          user_name: ['', [Validators.required,]],
          user_phone: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10),Validators.pattern(/^[0-9]*$/g)]], //
          client: ['', [Validators.required]],
          price_route: [0],
          location: this.formBuilder.group({
            start: this.formBuilder.group({
              address: ['', [Validators.required]],
              location: [null, [Validators.required]],
              indications: ['']
            }),
          }),
          distance:['']
        })
    
        // añadiendo informacion del cliente desde el localStorageService
        this.memberships = (await this.localStorage.get(environment.cookieTag)).memberships;
        this.formPackage
          .get('client')
          .setValue((await this.localStorage.get(environment.cookieTag)).email)
    
    
  }

}
