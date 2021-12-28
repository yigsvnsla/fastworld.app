import { ToolsService } from 'src/app/services/tools.service';
import { ConectionsService } from 'src/app/services/conections.service';
import { environment } from './../../../environments/environment';
import { LocalStorageService } from './../../services/local-storage.service';
import { User } from './../../interfaces/interfaces';
import { formatCurrency } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-historial-modal',
  templateUrl: './historial-modal.component.html',
  styleUrls: ['./historial-modal.component.scss'],
})
export class HistorialModalComponent implements OnInit {

  @Input() data : any 
  @Input() role: string

  constructor(
    private modal:ModalController,
    private conection:ConectionsService,
    private tools:ToolsService
  ) { 
  }

  async ngOnInit() {
    console.log(this.data);
    
  }

  onExit(){
    this.modal.dismiss()
  }

  deleteItem(){
    this.tools.showAlert({
      header:'Eliminar 🛑',
      subHeader:'Usted esta a punto de eliminar a este usuario del sistema',
      cssClass:'alert-danger',
      buttons:[
        {
          text:'Cancelar',
          role:'cancel'
        },{
          text:'Confirmar',
          role:'success',
          handler: ()=>{
            this.conection.delete(`products/${this.data.id}`);
            this.modal.dismiss()
          }
        }
      ]
    })
  }

  formatPrice(value: number | string){
    return formatCurrency( typeof value == 'string' ? Number(value) : value, 'en-us', '$')
  }

}
