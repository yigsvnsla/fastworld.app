import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ConectionsService } from './../../services/conections.service';
import { format, isValidPhoneNumber } from 'libphonenumber-js';



import { Country, State, City } from 'country-state-city'
import {ICity, ICountry, IState} from 'country-state-city/lib/interface'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  public formRegister: FormGroup

  public state = State
  public country = Country
  public city = City

  public locationUser: {
    state?: IState,
    city?: ICity
  }


  // Variable para la lista de regiones
  regions: any;
  stateList: any;
  cityList: any;

  // public countrys: ICountry[]
  // public country: ICountry
  // public states : IState[]
  // public state : IState
  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private conection: ConectionsService
  ) {

    this.locationUser = {
      state: {
        isoCode: '',
        name: '',
        countryCode: ''
      },
      city:{
        countryCode:'',
        name:'',
        stateCode:''
      }

    }
  }

  log() {
    console.log(this.formRegister.value)
  }

  async ngOnInit() {
    this.formRegister = this.formBuilder.group({
      status: "pendiente",
      role: ['', [Validators.required]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phone: ['', [Validators.required,
      (user_phone: FormControl) => {
        if (user_phone.value != '') {
          if (user_phone.value.match(/ /g)) user_phone.patchValue(user_phone.value.replace(/ /g, ''))
          if (user_phone.value.match(/^\+/) != null) {
            return isValidPhoneNumber(user_phone.value) ? null : { user_phone: true };
          }
          if (RegExp(/[0-9]/g).test(user_phone.value)) {
            return user_phone.value.length == 10 ? null : { user_phone: true }
          }
        }
      }]],
      email: ['', [Validators.required]],
      pwd: ['', [Validators.required]],
      document: this.formBuilder.group({
        dni: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]],
        country: [null],
        state:[null],
        city: [null, [Validators.required]],
        address: ['', [Validators.required]],
        vehicles: this.formBuilder.group({
          type: [null, [Validators.required]],
          enroller: [null, [Validators.required]],
          maker: [null, [Validators.required]],
          model: [null, [Validators.required]],
          year: [null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
          color: [null, [Validators.required]]
        }),
        image_dni: [<File>{ name: '' }],
        image_license: [<File>{ name: '' }]
      }),
    })



    //this.regions = await this.conection
    this.stateList = this.state.getStatesOfCountry("EC").map((element) => {
      let { name, isoCode } = element;
      return { name: name.replace(' Province', ''), isoCode };
    });
  }

  postFormat(control: AbstractControl) {
    if (RegExp(/[0-9]/g).test(control.value) && control.value.length == 10) {
      control.patchValue(format(control.value, 'EC', 'INTERNATIONAL').replace(/ /g, ''))
    }

  }

  async onSubmit(form: FormGroup) {
    const { document, role } = form.value
    let dni = document['image_dni'];
    let license = document['image_license']
    let request: FormData = new FormData();
    request.append('data', JSON.stringify(form.value))
    request.append('files.dni_photo', dni, new Date().getTime().toString());
    if (role == 'conductor') {
      request.append('files.license_driver', license, new Date().getTime().toString());
    }
    console.log(form.value)
    await this.conection.auth(request);
  }

  public async imgHandler(event: Event) {
    // si el evento tiene un archivo y si esta en el indice
    if (event.target['files'] && event.target['files'][0]) {
      // formControl mediante la toma del id del target busca y establece el valor del archivo
      this.formRegister.get('document').get(event.target['id']).setValue(event.target['files'][0])
    }
  }

  public setRole(role: 'cliente' | 'conductor') {
    this.formRegister.patchValue({ role: role });
  }

  onExit() {
    if (this.formRegister.get('role').value == '') {
      this.location.back();
    } else {
      this.formRegister = this.formBuilder.group({
        status: "pendiente",
        role: ['', [Validators.required]],
        name: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        email: ['', [Validators.required]],
        pwd: ['', [Validators.required]],
        document: this.formBuilder.group({
          dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(9)]],
          country: [''],
          state:[''],
          city: ['', [Validators.required]],
          address: ['', [Validators.required]],
          vehicles: this.formBuilder.group({
            type: [null, [Validators.required]],
            enroller: [null, [Validators.required]],
            maker: [null, [Validators.required]],
            model: [null, [Validators.required]],
            year: [null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
            color: [null, [Validators.required]]
          }),
          image_dni: [<File>{ name: '' }],
          image_license: [<File>{ name: '' }]
        }),
      })
    }
  }

  stateChanged(event){
    this.formRegister.get('document').get('state').setValue(event) ;
    this.cityList = City.getCitiesOfState("EC", event?.isoCode);
    console.log(this.formRegister.get('document').get('state').value)
  }
}