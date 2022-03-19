import { FavoresComponent } from '../../components/favores/favores.component';
import { NotFoundComponent } from './../../components/not-found/not-found.component';
import { LoginGuard } from './../../guards/login.guard';
import { DeliveryEncomiendasComponent } from './../../components/delivery-encomiendas/delivery-encomiendas.component';
import { MisEncomiendasComponent } from './../../components/mis-encomiendas/mis-encomiendas.component';
import { GenerarEncomiendaComponent } from './../../components/generar-encomienda/generar-encomienda.component';
import { ClientComponent } from './../../components/client/client.component';
import { HomeComponent } from './../../components/home/home.component';
import { HistorialComponent } from './../../components/historial/historial.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuPage } from './menu.page';
import { MyProfileComponent } from 'src/app/components/my-profile/my-profile.component';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'cliente',
        component: ClientComponent,
        children: [
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
          },
          {
            path: 'home',
            component: HomeComponent,
          },
          {
            path: 'encomienda',
            component: GenerarEncomiendaComponent,
          },
          {
            path: 'historial',
            component: HistorialComponent,
          },
          {
            path: 'mis-encomiendas',
            component: MisEncomiendasComponent,
          },
          {
            path:'mensajeria',
            component:FavoresComponent
          },
          {
            path: 'perfil',
            component: MyProfileComponent,
          },
          {
            path: '**',
            component: NotFoundComponent,
          },
        ],
        // ,canActivate:[LoginGuard]
      },
      {
        path: 'conductor',
        children: [
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
          },
          {
            path: 'home',
            component: HomeComponent,
          },
          {
            path: 'historial',
            component: HistorialComponent,
          },
          {
            path: 'mi-mochila',
            component: MisEncomiendasComponent,
          },
          {
            path: 'encomienda',
            component: DeliveryEncomiendasComponent,
          },
          {
            path: 'perfil',
            component: MyProfileComponent,
          },
          {
            path: '**',
            component: NotFoundComponent,
          },
        ],
        canActivate: [LoginGuard],
      },
    ],
    canActivate: [LoginGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
