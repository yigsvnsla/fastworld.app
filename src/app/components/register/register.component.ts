import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  public formRegister: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private location:Location
  ) { }

  ngOnInit() {
    this.formRegister = this.formBuilder.group({
      status: "pendiente",
      role: ['',[Validators.required]],
      name: ['',[Validators.required]],
      lastname: ['',[Validators.required]],
      phone: ['',[Validators.required]],
      email: ['',[Validators.required]],
      pwd: ['',[Validators.required]],
      document: this.formBuilder.group({
        dni: ['',[Validators.required,Validators.minLength(8), Validators.maxLength(9)]],
        city: ['',[Validators.required]],
        address: ['',[Validators.required]],
        vehicle: this.formBuilder.group({
          type: [null,[Validators.required]], 
          enroller: [null,[Validators.required]],
          maker: [null,[Validators.required]],
          model: [null,[Validators.required]],
          year: [null,[Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
          color: [null,[Validators.required]]
        })
      })
    })
  }

  onSubmit(form:FormGroup){
    console.log(form.value);
    
  }

  public async imgHandler(event: Event) {
    // si el evento tiene un archivo y si esta en el indice
    if (event.target['files'] && event.target['files'][0]) {
      // formControl mediante la toma del id del target busca y establece el valor del archivo
   
      //   this.formControl.controls['documents']['controls'][
    //     event.target['id']
    //   ].setValue(event.target['files'][0]);
    //   //frozamos a el elemento del DOM a pintar el nuevo valor del archivo mediante el evento generado por la target
    //   event['path'][6]['children'][event.target['id']]['children'][2].src =
    //     await this.imgReader(
    //       this.formControl.controls['documents']['controls'][event.target['id']]
    //         .value
    //     );
    }
  }

  public setRole(role: 'cliente' | 'conductor') {
    this.formRegister.patchValue( { role: role } );
  }

  onExit() {
    if (this.formRegister.get('role').value == ''){
      this.location.back();
    }else{
      this.formRegister.get('role').setValue('')
    }
  }
}


