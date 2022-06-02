import { ConectionsService } from 'src/app/services/conections.service';
import { exportExcelToDateOptions, XlsxService } from './../../services/xlsx.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/interfaces/interfaces';
import { EditProfileComponent } from './../edit-profile/edit-profile.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToolsService } from 'src/app/services/tools.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {

  public profile:User

  constructor(
    private tools:ToolsService,
    private localStorage:LocalStorageService,
    private xlsxService:XlsxService,
    private conectionsService:ConectionsService
  ){ 
    this.profile = {
      document:null,
      email:'',
      lastname:'',
      memberships:{
        expire:'',
        start:'',
        id:0,
        type:''
      },
      name:'',
      phone:'',
      role:'',
      status:'',
      id:0
    }
  }

  async ngOnInit() {
    this.profile = (await this.localStorage.get(environment.cookieTag))
    console.log(this.profile);
    
  }

  changePassword(){

  }

  exportExcel(){
    this.conectionsService
      .get('clients?email=cliente@fastworld.app')
      .then(client=>{
        console.log(client);
        
        this.xlsxService.exportExcelToDate({data:client[0].products,filename:''})
      })
  }

  editProfile(){
    this.tools.showModal({
      component:EditProfileComponent,
      backdropDismiss: false,
      componentProps:{
        profile:this.profile
      }
    })
  }
}
