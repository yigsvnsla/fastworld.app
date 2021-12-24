import { ToolsService } from './../../services/tools.service';
import { ConectionsService } from './../../services/conections.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './../../services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/interfaces';
import { parseISO, formatDistanceStrict} from 'date-fns'
import { es } from 'date-fns/locale'
@Component({
  selector: 'app-cliente',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public user : User
  public listMenu: any[]

  public formatDistanceStrict = (iso)=>{
    return formatDistanceStrict(parseISO(iso), new Date(Date.now()) ,{locale:es})
  }

  constructor(
    private localStorage : LocalStorageService,
    private conections : ConectionsService,
    public tools : ToolsService
  ) {


  }

  async ngOnInit() {

    this.user={
      name:'',
      lastname:'',
      email:'',
      membership:{
        id:0,
        type:'',
        start:'',
        end:''
      },
      document:null,
      phone:'',
      role:'',
      status:'',
    }
  }

  ionViewDidEnter() {
    this.localStorage
    .get(environment.cookieTag)
    .then(response=>{
      this.user = response;
      switch (this.user.role) {
        case 'cliente':
        this.listMenu = [
          {
            title: 'Nueva Encomienda',
            url: 'encomienda',
            icon: 'cube',
          },
          {
            title: 'Mis Encomiendas',
            url: 'mis-encomiendas',
            icon: 'arrow-redo',
          },
          
          {
            title: 'Historial',
            url: 'historial',
            icon: 'folder',
          },
        ]
          break;
        case 'conductor':
          this.listMenu = [
            {
              title: 'Encomiendas',
              url: 'encomienda',
              icon: 'cube',
            },
            {
              title: 'Mi Mochila',
              url: 'mi-mochila',
              icon: 'arrow-redo',
            },
            
            {
              title: 'Historial',
              url: 'historial',
              icon: 'folder',
            },
          ]
          break;
        default:
          console.error('no se consigue el rol');
          break;
      }
  
    })
  }

  async onLogOut(){
    await this.conections.logOut()
  }

}
