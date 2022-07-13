import { PopoverController, ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { ConectionsService } from 'src/app/services/conections.service';

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.scss'],
})
export class RegionListComponent implements OnInit {

  @Input() controller:PopoverController

  public regions$ : Observable<any>

  constructor(
    private conection: ConectionsService,
    private popoverController:PopoverController
  ) { }

  ngOnInit() {
    this.regions$ = this.conection.rawGet('/regions')
    .pipe(
      delay(400),
    )
    
  }

  async onSelect(region){
    (await this.popoverController.getTop()).dismiss(region)  
  }

}
