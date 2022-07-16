import { ConectionsService } from './../../services/conections.service';
import { ShareUrlModalComponent } from './../share-url-modal/share-url-modal.component';
import { UbicacionModalComponent } from './../ubicacion-modal/ubicacion-modal.component';
import { environment } from './../../../environments/environment';
import { LocalStorageService } from './../../services/local-storage.service';
import { ToolsService } from './../../services/tools.service';
import { add, parseISO } from 'date-fns';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonDatetime, IonButton } from '@ionic/angular';
import { formatCurrency, Location } from '@angular/common';
import { Memberships } from 'src/app/interfaces/interfaces';
import { MapDirectionsService } from '@angular/google-maps';
import { Router } from '@angular/router';
import {
  parsePhoneNumber,
  isValidPhoneNumber,
  format,
} from 'libphonenumber-js';
@Component({
  selector: 'app-generar-encomienda',
  templateUrl: './generar-encomienda.component.html',
  styleUrls: ['./generar-encomienda.component.scss'],
})
export class GenerarEncomiendaComponent implements OnInit {
  @ViewChild('dateTime') dateTime: IonDatetime;
  @ViewChild('btnSubmit') btnSubmit: IonButton

  public add = add;

  public timeNow: Date;
  public formPackage: FormGroup;
  public categoryList: any[];
  public timeOutList: any[];
  public formattedAmount: string;
  public memberships: Memberships | string;

  public kilometerRef;

  //User data
  user: any;

  constructor(
    public tools: ToolsService,
    private formBuilder: FormBuilder,
    private localStorage: LocalStorageService,
    private mapDirectionsService: MapDirectionsService,
    private conection: ConectionsService,
    private router: Router,
    private location: Location
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
    ];
    this.timeOutList = [30, 45, 60];
    this.timeNow = new Date(Date.now());
  }

  async ngOnInit() {
    await this.instance();
    this.user = await this.localStorage.get(environment.cookieTag);
    if (this.user?.region?.enable != true) {
      this.tools.showAlert({
        backdropDismiss: true,
        header: 'Alerta ⚠',
        cssClass: 'alert-warn',
        subHeader: 'La region donde te encuentras no esta disponible en estos momentos',
        buttons: ['ok'],
      })
        .then(() => {
          this.location.back()
        })
    }
  }

  async ionViewWillEnter() {
    await this.instance();
  }

  async onSubmit(form: FormGroup) {
    // Check if province is enable to create a news products


    if (this.user.region?.enable) {
      await this.conection
        .post('products', { ...form.value, region: this.user.region.id })
        .then((Response) => console.log(Response));
      await this.router.navigateByUrl('/menu/cliente/mis-encomiendas');
    } else {
      this.tools.showAlert({
        backdropDismiss: true,
        header: 'Alerta ⚠',
        cssClass: 'alert-warn',
        subHeader: 'La region donde te encuentras no esta disponible en estos momentos',
        buttons: ['ok'],
      });
    }
  }

  async dateTimeChange(event: Event) {
    // si la fecha actual es menor a 1 hora con 30  minutos, disparar una alerta, en caso contrario asignar valor a el formControl "timeOut"
    if (new Date(Date.now()) < this.add(parseISO((event as CustomEvent).detail.value), { hours: 1, minutes: 30 })) {
      this.formPackage
        .get('timeout')
        .setValue((event as CustomEvent).detail.value);
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
                .setValue(new Date(Date.now()).toISOString());
            },
          },
        ],
      });
    }
  }

  genTicket() {
    if (this.user.region.enable) {
      this.tools.showAlert({
        backdropDismiss: false,
        header: 'Alerta ⚠',
        cssClass: 'alert-warn',
        subHeader: `A continuacion va a generar un 'ticket' `,
        message: 'Solo use esta opcion en caso de no saber la ubicacion o informacion de su cliente',
        buttons: [{
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Continuar',
          role: 'success',
          handler: async () => {
            if ((this.formPackage.get('user_name').value == '') && (this.formPackage.get('user_phone').value == '')) {
              this.formPackage.get('user_name').reset();
              this.formPackage.get('user_phone').reset();
            }

            if (this.formPackage.valid) {
              await this.conection.post('products', { ...this.formPackage.value, region: this.user.region.id, ticket: true })
                .then(response => {
                  this.tools
                    .showModal({
                      component: ShareUrlModalComponent,
                      backdropDismiss: false,
                      componentProps: {
                        url: `https://fastworld.app/encomienda/${response['id']}`
                      },
                    })
                })
            } else {
              console.log('dasdsadsa');
              this.tools.showAlert({
                header: 'Alerta ⚠',
                cssClass: 'alert-warn',
                subHeader: 'Por favor completar los datos de envio',
                buttons: ['Aceptar'],
              });
            }
          }
        }]
      })
    } else {
      this.tools.showAlert({
        backdropDismiss: true,
        header: 'Alerta ⚠',
        cssClass: 'alert-warn',
        subHeader: 'La region donde te encuentras no esta disponible en estos momentos',
        buttons: ['Aceptar'],
      })
    }
  }

  setUbication(origin: 'start' | 'goal') {
    this.tools
      .showModal({
        component: UbicacionModalComponent,
        cssClass: 'ubication-modal',
        backdropDismiss: false,
        componentProps: {
          origin: origin,
        },
      })
      .then((data) => {
        if (data) {
          switch (origin) {
            case 'goal':
              if (!(this.formPackage.get('location') as FormGroup).value.hasOwnProperty('goal')) {
                (this.formPackage.get('location') as FormGroup)
                  .addControl('goal', this.formBuilder.group({
                    address: ['', []],
                    location: [null, []],
                    indications: [''],
                  }));
              }
              this.formPackage.controls.location.get(data.origin).patchValue({
                address: data.address,
                location: data.location,
              });
              this.mapDirectionsService
                .route({
                  origin: this.formPackage.controls.location.get('start').get('location').value,
                  destination: this.formPackage.controls.location.get('goal').get('location').value,
                  travelMode: google.maps.TravelMode.DRIVING,
                  unitSystem: google.maps.UnitSystem.METRIC,
                })
                .subscribe(({ result, status }) => {
                  if (status == google.maps.DirectionsStatus.OK) {
                    this.kilometerRef = result.routes[0].legs[0].distance.text;
                    this.formPackage.get('distance').setValue(result.routes[0].legs[0].distance.text)
                    if (this.memberships == null) {

                      let km = Number(result.routes[0].legs[0].distance.text.replace(/km/, '').replace(/,/, '.').trim());
                      let multiplicador = Math.ceil( km / 6);
                      let base = this.user.region.price_base;
                      let start = this.user.region.price_start;
                      let tarifa = (multiplicador * start) + base;
                      this.formPackage.get('price_route').setValue(tarifa.toString())

                     /*  this.formPackage
                        .get('price_route')
                        .setValue((Math.round(Number(result.routes[0].legs[0].distance.text.replace(/km/, '').replace(/,/, '.').trim())) * this.user.region.price_start + this.user.region.price_base).toString()) */
                    }
                  }
                });
              break;
            case 'start':
              this.formPackage.controls.location.get(data.origin).patchValue({
                address: data.address,
                location: data.location,
              });
              break;
            default:
              console.error('origin not found');
              break;
          }
        }
      });
  }

  eventPriceFocus(event) {
    event.target.value = null;
  }

  eventPriceBlur(event) {
    this.formPackage.get('price').setValue(Number(event.target.value));
    this.formattedAmount = formatCurrency(parseFloat(event.target.value.trim()), 'en-US', '$');
  }

  addDesc(event: Event, origin: string) {
    this.formPackage.controls.location.get(origin).patchValue({
      indications: (event as CustomEvent).detail.value,
    });
  }

  postFormat(control: AbstractControl) {
    if (RegExp(/[0-9]/g).test(control.value) && control.value.length == 10) {
      control.patchValue(format(control.value, 'EC', 'INTERNATIONAL').replace(/ /g, ''));
    }
  }

  private async instance() {
    // Creando instancia de el formulario de la encomienda
    this.formPackage = this.formBuilder.group({
      type: ['', [Validators.required]],
      price: [0, [Validators.required]],
      timeout: ['', [Validators.required]],
      // ajustar patron regex para validar el input "UserName" Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g)
      user_name: ['', [(user_name: FormControl) => {
        if (user_name.value == null) return null
        if (user_name.value == '') return { user_name: true }
        if (user_name.value != '' && (user_name.value as string).match(/([a-zA-z])/g)) {
          return null
        } else {
          return { user_name: true }
        }
      }]],
      user_phone: ['', [(user_phone: FormControl) => {
        if (user_phone.value == null) return null
        if (user_phone.value == '') return { user_phone: true }
        if (user_phone.value != '' && user_phone.value != null) {
          if ((user_phone.value as string).match(/([0-9])/g)) {
            if (user_phone.value.match(/ /g))
              user_phone.patchValue(user_phone.value.replace(/ /g, ''));
            if (user_phone.value.match(/^\+/) != null) {
              return isValidPhoneNumber(user_phone.value) ? null : { user_phone: true };
            }
            if (RegExp(/[0-9]/g).test(user_phone.value)) {
              return user_phone.value.length == 10 ? null : { user_phone: true };
            }
          } else {
            return { user_phone: true }
          }
        }
      }]],
      client: ['', [Validators.required]],
      price_route: [0],
      location: this.formBuilder.group({
        start: this.formBuilder.group({
          address: ['', [Validators.required]],
          location: [null, [Validators.required]],
          indications: [''],
        }),
      }),
      distance: [''],
    });

    // añadiendo informacion del cliente desde el localStorageService
    this.memberships = (await this.localStorage.get(environment.cookieTag)).memberships;
    this.formPackage
      .get('client')
      .setValue((await this.localStorage.get(environment.cookieTag)).email);

    this.formPackage.valueChanges.subscribe(form => {
      if (this.btnSubmit != undefined) {
        if ((form as Object)['location'].hasOwnProperty('goal')) {
          if ((this.formPackage.get('user_name').status == 'INVALID') || (this.formPackage.get('user_phone').status == 'INVALID')) {
            this.btnSubmit.disabled = true
          } else {
            this.btnSubmit.disabled = false
          }
        } else {
          if ((this.formPackage.get('user_name').status == 'VALID') && (this.formPackage.get('user_phone').status == 'VALID')) {
            this.btnSubmit.disabled = false
          } else {
            if ((this.formPackage.get('user_name').status == 'INVALID') && (this.formPackage.get('user_phone').status == 'INVALID')) {
              this.btnSubmit.disabled = false
            }
            else {
              this.btnSubmit.disabled = true
            }
          }
        }
      }
    })

  }
}
