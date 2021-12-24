import { RegisterComponent } from './../../components/register/register.component';
import { LoginComponent } from './../../components/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';

const routes: Routes = [
  {
    path: '',
    redirectTo:'ingresar',
    pathMatch:'full'
  },{
    path:'ingresar',
    component:LoginComponent
  },{
    path:'registrar',
    component: RegisterComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
