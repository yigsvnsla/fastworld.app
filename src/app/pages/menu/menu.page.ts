import { ToolsService } from './../../services/tools.service';
import { ConectionsService } from './../../services/conections.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './../../services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/interfaces';
import { parseISO, formatDistanceToNowStrict } from 'date-fns'
import { es } from 'date-fns/locale'
@Component({
  selector: 'app-cliente',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public user: User
  public listMenu: any[]
  public generalOptions: any[]
  public roleOptions: any[]

  public formatDistanceStrict = (IsoExpire) => {
    return IsoExpire ? formatDistanceToNowStrict(parseISO(IsoExpire), { unit: 'day', locale: es }) : ''
  }

  constructor(
    private localStorage: LocalStorageService,
    private conections: ConectionsService,
    public tools: ToolsService
  ) {


  }

  async ngOnInit() {
    this.user = {
      name: '',
      lastname: '',
      email: '',
      memberships: {
        id: 0,
        type: '',
        start: '',
        expire: ''
      },
      document: null,
      phone: '',
      role: '',
      status: '',
    }
  }

  ionViewDidEnter() {
    this.localStorage
      .get(environment.cookieTag)
      .then(response => {
        this.user = response;
        switch (this.user.role) {
          case 'cliente':
            this.roleOptions = [
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
            this.roleOptions = [
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
        this.generalOptions = [{
          title: 'Mi Perfil',
          url: 'perfil',
          icon: 'person',
        },]
        this.listMenu = Array.prototype.concat(this.roleOptions,this.generalOptions)
      })
  }

  async onLogOut() {
    await this.conections.logOut()
  }

}
