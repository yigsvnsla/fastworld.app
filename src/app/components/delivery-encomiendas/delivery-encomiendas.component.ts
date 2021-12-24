import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatDistanceStrict, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Socket } from 'ngx-socket-io';
import { Products } from 'src/app/interfaces/interfaces';
import { ConectionsService } from 'src/app/services/conections.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToolsService } from 'src/app/services/tools.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-delivery-encomiendas',
  templateUrl: './delivery-encomiendas.component.html',
  styleUrls: ['./delivery-encomiendas.component.scss'],
})
export class DeliveryEncomiendasComponent implements OnInit {

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
  }

  async ngOnInit() {
    // Datos necesarios para el correcto funcionamiento del componente, el cual debe consumir la API
    // A traves del metodo GET con su correspondiente identificador, el cual en este caso es el correo.
    // filtramos mediante el rol del usuario desde el localStorage para reutilizar el componente
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
    this.packagesList = await this.conections.get( `products?status_eq=pendiente`)
  }

  async goTo(){
    this.router.navigateByUrl(`/menu/${(await this.localStorage.get(environment.cookieTag)).role}/encomienda`)
  }

  // handler que se encarga de manejar las encomiendas seleccionadas.
  async selectPackage(item: any, i: number) {
    this.conections.post(`products/driver`,{
      driver: (await this.localStorage.get(environment.cookieTag)).email,
      product: item.id
    })
    .then(response=>{
      // Dependiendo del status que devuelve el backend, se debe mostrar su correspondiente aviso
      switch (response.status) {
        // Code 200, "Usuario autorizado para obtener la encomienda"
        case "200":
          this.packagesList.splice(i, 1);
          break;
        // Code 403, "Usuario no autorizado para obtener la encomienda, debido a limite alcanzado"
        case "403":
          this.tools.showAlert({
            backdropDismiss:false,
            header:'Alerta ⚠',
            subHeader:'Usuario no autorizado para obtener la encomienda, debido a limite alcanzado',
            cssClass:'alert-warn',
            buttons:[{
                text:'Ok', 
                role:'success'
            }]
          })
          break;
        default:
          break;
      }
    })
  }
  
}
