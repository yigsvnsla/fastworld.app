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
    private localStorage:LocalStorageService
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
