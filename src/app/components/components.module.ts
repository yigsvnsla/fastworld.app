import { NotFoundComponent } from './not-found/not-found.component';
import { DeliveryEncomiendasComponent } from './delivery-encomiendas/delivery-encomiendas.component';
import { GenerarEncomiendaComponent } from './generar-encomienda/generar-encomienda.component';
import { MisEncomiendasComponent } from './mis-encomiendas/mis-encomiendas.component';
import { ShareUrlModalComponent } from './share-url-modal/share-url-modal.component';
import { UbicacionModalComponent } from './ubicacion-modal/ubicacion-modal.component';
import { HistorialModalComponent } from './historial-modal/historial-modal.component';
import { OffLineModalComponent } from './off-line-modal/off-line-modal.component'
import { HistorialComponent } from './historial/historial.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { ClientComponent } from './client/client.component';
import { LoginComponent } from './login/login.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ClientComponent,
    HistorialComponent,
    HistorialModalComponent,
    GenerarEncomiendaComponent,
    UbicacionModalComponent,
    ShareUrlModalComponent,
    MisEncomiendasComponent,
    DeliveryEncomiendasComponent,
    OffLineModalComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule,
    GoogleMapsModule
  ]
})
export class ComponentsModule { }