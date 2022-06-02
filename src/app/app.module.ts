import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { ComponentsModule } from './components/components.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { CurrencyPipe } from '@angular/common';
import { SocketIoModule } from 'ngx-socket-io';
import { NgModule } from '@angular/core';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserAnimationsModule,
    IonicModule.forRoot(), 
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    ComponentsModule,
    HttpClientModule,
    GoogleMapsModule,
    ScrollingModule,
 
    SocketIoModule.forRoot({ url: 'https://api.fastworld.app', options: {autoConnect: false}}),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    CookieService,CurrencyPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
