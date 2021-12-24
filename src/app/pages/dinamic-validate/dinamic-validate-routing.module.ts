import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DinamicValidatePage } from './dinamic-validate.page';

const routes: Routes = [
  {
    path: '',
    component: DinamicValidatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DinamicValidatePageRoutingModule {}
