import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DinamicValidatePageRoutingModule } from './dinamic-validate-routing.module';

import { DinamicValidatePage } from './dinamic-validate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DinamicValidatePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DinamicValidatePage]
})
export class DinamicValidatePageModule {}
