import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './off-line-modal.component.html',
  styleUrls: ['./off-line-modal.component.scss']
})
export class OffLineModalComponent implements OnInit { 

  public image : string

  constructor(
    private ModalController:ModalController
  ) { 
    this.image = "../../../../assets/svg/undraw_Internet.svg"
  }

  ngOnInit(): void {
  }

  onClick():void{
    

    this.ModalController.dismiss()

  }

}
