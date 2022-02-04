import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToolsService } from './../../services/tools.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ConectionsService } from './../../services/conections.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public formLogin:FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private conection: ConectionsService,
    private tool:ToolsService,
    private router:Router
    ) {
      
     }

  ngOnInit() {
      this.formLogin = this.formBuilder.group({
        email:['',[Validators.required, ]], 
        password:['',[Validators.required, Validators.minLength(6)]],
        origin:['app']
      });
    
    // Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
  }

  ionViewWillEnter() {
  }

  async submit( form: FormGroup){
    this.conection.auth(form.value)
  }


  async rescuePass(){
    await this.tool.showAlert({
      cssClass:'alert-primary',
      header:'Recuperar Contraseña',
      subHeader:'Para recuperar tu contraseña ingresa tu correo electronico 🔐',
      inputs:[{
        name:'email',
        type:'email',
        placeholder:'correo electronico'
      }],
      buttons:[{
        text:'Cancelar',
        role:'cancel'
      },{
        text:'Continuar',
        role:'success',
        handler:async inputValue=>{
          if(inputValue.email != ''){
            await this.tool.showAlert({
              cssClass:'alert-success',
              header:'Confirmar ✔',
              subHeader:'Continue para confirmar su solicitud',
              buttons:[{
                text:'ok',
                handler:()=>{
                  console.log(inputValue);
                }
              }]
            })
          }else{
          await this.tool.showAlert({
              cssClass:'alert-danger',
              header:'Ingresar datos validos 🛑',
              subHeader:'Para recuperar tu contraseña ingresa tu e-mail',
              buttons:[{
                text:'ok',
                handler:()=>{
                  this.rescuePass()
                }
              }]
            })
          }          
        }
      }]
    })

  }

}
