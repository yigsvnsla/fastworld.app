import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-favores-modal-form',
  templateUrl: './favores-modal-form.component.html',
  styleUrls: ['./favores-modal-form.component.scss'],
})
export class FavoresModalFormComponent implements OnInit {

  @Input() Item : any

  public formProduct : FormGroup
  public formattedAmount  : string = ''

  constructor(
    private formBuilder:FormBuilder,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.formProduct = this.formBuilder.group({
      name:[this.Item != undefined? this.Item.name : '', [Validators.required ]],
      unit:this.formBuilder.group({
        measure:[ this.Item != undefined? this.Item.unit.measure : 'cant' ],
        value:[ this.Item != undefined? this.Item.unit.value : 1 ,[Validators.required]]
      }),
      description:[this.Item != undefined? this.Item.description : '',[Validators.required]]
    })
  }

  onExit(data = null){
    this.modalController.dismiss(data)
  }

  add(){
    this.onExit(this.formProduct.value)
  }

  eventPriceFocus(event) {
    event.target.value = null;
  }

  eventPriceBlur(event) {
    this.formProduct.get('unit').get('value').setValue(Number(event.target.value));
    this.formattedAmount = formatCurrency( parseFloat(event.target.value.trim()), 'en-US', '$' );
  }

}
