import { ToolsService } from 'src/app/services/tools.service';
import { User } from 'src/app/interfaces/interfaces';
import { IonButton, IonContent, ModalController } from '@ionic/angular';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConectionsService } from 'src/app/services/conections.service';
import { format, isValidPhoneNumber } from 'libphonenumber-js';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  @Input() profile:User

  @ViewChild('btnUpdate') btnUpdate: IonButton
  
  public formProfile: FormGroup

  public pageLoad = false
  constructor(
    private modalController:ModalController,
    private formBuilder: FormBuilder,
    private conection: ConectionsService,
    private tools:ToolsService
  ) { 
    this.formProfile = this.formBuilder.group({
      role: ['', []],
      name: ['', []],
      lastname: ['', []],
      email: ['', []],
      phone: ['', []],
      membership: [''],
      status: [''],
      document: this.formBuilder.group({
        id: [''],
        client: [''],
        city: [''],
        dni: [''],
        address: [''],
        dni_photo: [''],
        license_driver: [''],
        created_at: [''],
        updated_at: [],
      })
    })
  }

  ionViewWillEnter(){
  }

  ionViewDidEnter() {    
    this.pageLoad=true
    
  }
  
  ngOnInit() {
    this.formProfile = this.formBuilder.group({
      role: [this.profile.role, []],
      name: [this.profile.name, [Validators.required]],
      lastname: [this.profile.lastname, [Validators.required]],
      email: [this.profile.email, [Validators.required]],
      phone: [this.profile.phone, [Validators.required]],
      memberships: [this.profile.memberships, [Validators.required]],
      status: [this.profile.status, [Validators.required]],
      document: this.formBuilder.group({
        id: [this.profile.document.id, [Validators.required]],
        client: [this.profile.document.client, [Validators.required]],
        city: [this.profile.document.city, [Validators.required]],
        address: [this.profile.document.address, [Validators.required]],
        dni: [this.profile.document.dni, [Validators.required]],
        dni_photo: [this.profile.document.dni_photo, [Validators.required]],
        license_driver: [this.profile.document.license_driver, [Validators.required]],
        created_at: [this.profile.document.created_at],
        updated_at: [this.profile.document.updated_at],
      })
    }) 

    if (this.formProfile.get('role').value == 'conductor') {
      (this.formProfile.get('document') as FormGroup)
        .addControl('vehicles', this.formBuilder.group({
          color: [this.profile.document.vehicle.color, [Validators.required]],
          enroller: [this.profile.document.vehicle.enroller, [Validators.required]],
          id: [this.profile.document.vehicle.id, [Validators.required]],
          maker: [this.profile.document.vehicle.maker, [Validators.required]],
          model: [this.profile.document.vehicle.model, [Validators.required]],
          type: [this.profile.document.vehicle.type, [Validators.required]],
          year: [this.profile.document.vehicle.year, [Validators.required]]
        }))
    }

    this.formProfile.valueChanges
      .subscribe(change=>{
        this.btnUpdate.disabled = this.tools.compareObjets(change,this.profile)
      }) 
  }
  
  postFormat(control:AbstractControl){
    if (RegExp(/[0-9]/g).test(control.value) && control.value.length == 10 ){
      control.patchValue(format(control.value,'EC','INTERNATIONAL').replace(/ /g,''))  
    } 

  }

  exit(){
    this.modalController.dismiss()
  }

  onUpdate(form:FormGroup){

  }
}
