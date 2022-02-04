import { RegisterComponent } from './../../components/register/register.component';
import { LoginComponent } from './../../components/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';
import { AutoloadGuard } from 'src/app/guards/autoload.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo:'ingresar',
    pathMatch:'full'
  },{
    path:'ingresar',
    component:LoginComponent,
    canActivate:[AutoloadGuard]
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
