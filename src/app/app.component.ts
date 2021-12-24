import { ConectionsService } from 'src/app/services/conections.service';
import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private conections: ConectionsService,
    private sw: SwUpdate
  ) { }

  ngOnInit(): void {
    this.conections.isOnline();
    if(!this.sw.isEnabled){
      console.log("Service worker not enable on this moment")
      return;
    }

    this.sw.versionUpdates
      .subscribe(data=>{
        console.log("update");
        location.reload();
      })

      
    // this.sw.available.subscribe(data=>{
    //   console.log("update");
    //   location.reload();
    // })
  }
}
