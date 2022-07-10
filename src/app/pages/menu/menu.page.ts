import { ToolsService } from './../../services/tools.service';
import { ConectionsService } from './../../services/conections.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './../../services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { parseISO, formatDistanceToNowStrict, intervalToDuration } from 'date-fns'
import { es } from 'date-fns/locale'
import { Router } from '@angular/router';


@Component({
  selector: 'app-cliente',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public user: any
  public listMenu: any[]
  public generalOptions: any[]
  public roleOptions: any[]

  public formatDistanceStrict = (IsoExpire) => {
    return IsoExpire ? formatDistanceToNowStrict(parseISO(IsoExpire), { unit: 'day', locale: es }) : ''
  }

  constructor(
    private localStorage: LocalStorageService,
    private conections: ConectionsService,
    public tools: ToolsService,
    private router: Router
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
      region:{
        state: '',
        city: '',
        start_price: '',
        base_price: ''
      }
    }
  }

  async ionViewDidEnter() {
    if(!(await this.localStorage.check(environment.cookieTag))){
      this.router.navigateByUrl('/auth')
    }else{
      this.conections.startService(await this.localStorage.get(environment.cookieTag));
      this.conections.get(`clients?id_eq=${(await this.localStorage.get(environment.cookieTag)).id}`)
        .then(async res => {
          await this.localStorage.update(environment.cookieTag,res[0])
          this.localStorage
            .get(environment.cookieTag)
            .then(response => {
              this.user = response;
              if (this.user.role == 'cliente' && this.user.memberships != null) {
                if ((intervalToDuration({start: new Date(Date.now()), end: parseISO(this.user.memberships.expire)}).days >= 1) && (intervalToDuration({start: new Date(Date.now()), end: parseISO(this.user.memberships.expire)}).days < 3 ) ) {
                  this.tools.showAlert({
                    header:'Alerta ⚠',
                    subHeader: `su membrecia vence en ${intervalToDuration({start: new Date(Date.now()),end: parseISO(this.user.memberships.expire)}).days} dias,una vez expirada solo podra enviar encomiendas por costo de ruta`,
                    buttons:['ok']
                  })
                }
              }
              switch (this.user.role) {
                case 'cliente':
                  this.roleOptions = [
                    {
                      title: 'Encomienda',
                      url: 'encomienda',
                      icon: 'cube',
                    },{
                      title: 'Mensajeria',
                      url: 'mensajeria',
                      icon: 'walk'
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
                icon: 'person'
              }]
              this.listMenu = Array.prototype.concat(this.roleOptions,this.generalOptions)
            })
        })
    }
  }

  async onLogOut() {
    await this.conections.logOut()
  }

}
