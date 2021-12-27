import { Router } from '@angular/router';
import { formatDistanceStrict, parseISO } from 'date-fns';
import { ToolsService } from './../../services/tools.service';
import { environment } from './../../../environments/environment';
import { LocalStorageService } from './../../services/local-storage.service';
import { ConectionsService } from './../../services/conections.service';
import { Products } from './../../interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-mis-encomiendas',
  templateUrl: './mis-encomiendas.component.html',
  styleUrls: ['./mis-encomiendas.component.scss'],
})
export class MisEncomiendasComponent implements OnInit {

  public role : string
  public packagesList: Products[]
  public formatDistanceStrict = (iso,base) =>{
    return formatDistanceStrict(parseISO(iso),parseISO(base),{locale:es})
  }


  constructor(
    private conections:ConectionsService,
    private localStorage: LocalStorageService,
    private socket: Socket,
    private tools:ToolsService,
    private router:Router
  ) {
    this.packagesList = []
    this.role = ''
  }

  async ngOnInit() {
    // Datos necesarios para el correcto funcionamiento del componente, el cual debe consumir la API
    // A traves del metodo GET con su correspondiente identificador, el cual en este caso es el correo.
    // filtramos mediante el rol del usuario desde el localStorage para reutilizar el componente
    this.role = (await this.localStorage.get(environment.cookieTag)).role
    // y asi hacer una consulta a un endpoint en especifico segun sea su rol
    
    await this.getData()

    //Funcion que se ejecuta con cualquer evento de producto creado.
    //Variable data hace referencia al producto nuevo en formato JSON.
    this.socket.on("product-new", async (data) => {
      // insertar producto nuevo en el array de productos.
      this.packagesList.unshift(data)
      // O actualizar la lista completa con un GET
    })

    //Funcion que se ejecuta con cualquier evento de producto actualizado.
    //Debe refrescar la lista de productos haciendo un GET
    //Variable data hace referencia al ID del producto actualizado
    this.socket.on("product-updated", async (data) => {
      console.log(data);
      
      await this.getData()
    });
    console.log(this.packagesList);
    
  }

  // Funcion encargada de consultar lista de encomienda a traves de GET y actualizar el DOM
  private async getData(){
    switch (this.role) {
      case 'cliente':
        this.packagesList = await this.conections.get(`products?client.email_eq=${(await this.localStorage.get(environment.cookieTag)).email}`)
        break;
      case 'conductor':
        this.packagesList = await this.conections.get( `products?driver_eq=${(await this.localStorage.get(environment.cookieTag)).email}&status_eq=recibido`)
        break;
      default:
        console.error('no se encuentra el rol del usuario');
        break;
    }
  }

  transfer(index:number){
    this.tools.showAlert({
      header:'Traspasar 📦',
      subHeader:'Vas a transferir esta encomienda a un compañero',
      cssClass: 'alert-success',
      inputs:[
        {
          name: 'code',
          id: 'code',
          type: 'text',
          placeholder: 'Codigo del Compañero'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirmar',
          handler: async (val) => {
            this.conections.post('products/send',{driver:(await this.localStorage.get(environment.cookieTag)).document.dni,product:val})
              .then(response=>{
                console.log(response);
              })
              .catch(err=>{
                this.tools.showAlert({
                  cssClass:'alert-warm',
                  header:'Alerta ⚠',
                  subHeader:'este compañero no existe porfavor intenta de nuevo 🤷‍♂️',
                  buttons:[{
                    text:'ok',
                    role:'success',
                    handler:async ()=>{
                      this.transfer(index)
                    }
                  }]
                })
              })
          }
        }
      ]
    })
  }

  delivered(index:number){
    this.tools.showAlert({
      header:'Entregado ✔',
      subHeader:'Confirma la entrega de la encomienda 📦',
      cssClass: 'alert-success',
      inputs:[
        {
          name: 'paragraph',
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Describe lo sucedido aqui.'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirmar',
          handler: async () => await this.conections
            .put(`products/${index}`, {status:'entregado'})
            .then( response => {
              if(response.id){
                this.packagesList = [...this.packagesList.filter( element => {
                  return response.id!= element['id'];
                })]
              }
            })
        }
      ]
    })
  }

  report(index:number){
    this.tools.showAlert({
      header:'Reportar Envio 🚫',
      cssClass:'alert-danger',
      subHeader:'Si hay un inconvenites con el envio puedes reportalo 😉',
      inputs:[
        {
          name: 'paragraph',
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Describe lo sucedido aqui.'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Reportar',
          role: 'success',
          handler: async () => await this.conections
            .put(`products/${index}`, {status:'rechazado'})
            .then( response => {
              if(response.id){
                this.packagesList = [...this.packagesList.filter( element => {
                  return response.id!= element['id'];
                })]
              }
            })
        }]
    })
  }

  async goTo(){
    this.router.navigateByUrl(`/menu/${(await this.localStorage.get(environment.cookieTag)).role}/encomienda`)
  }

}
