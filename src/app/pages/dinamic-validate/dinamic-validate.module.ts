import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DinamicValidatePageRoutingModule } from './dinamic-validate-routing.module';

import { DinamicValidatePage } from './dinamic-validate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DinamicValidatePageRoutingModule
  ],
  declarations: [DinamicValidatePage]
})
export class DinamicValidatePageModule {}
