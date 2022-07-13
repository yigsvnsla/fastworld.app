import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ConectionsService } from 'src/app/services/conections.service';
import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
/* import { registerPlugin } from '@capacitor/core';
import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation'
); */

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private conections: ConectionsService,
    private sw: SwUpdate,
    private localStorage: LocalStorageService,
  ) { 
    
  }

  ngOnInit(): void {
    /* BackgroundGeolocation.addWatcher(
      {
        backgroundMessage: 'Ubicacion activada',
        backgroundTitle: 'Fastworld GPS',
        requestPermissions: true,
        stale: false,
        distanceFilter: 50,
      },
      (location, error) => {
        console.log('whatcher agregado con exito');
        console.log(location);
      }
    ); */

    this.conections.isOnline();

    if (this.sw.isEnabled) {
      this.sw.versionUpdates.subscribe(async (data) => {
        await this.localStorage.remove(environment.cookieTag);
        console.log('update');
        location.reload();
      });
    } else {
      console.log('Service worker not enable on this moment');
    }
    // this.sw.available.subscribe(data=>{
    //   console.log("update");
    //   location.reload();
    // })
  }
}
