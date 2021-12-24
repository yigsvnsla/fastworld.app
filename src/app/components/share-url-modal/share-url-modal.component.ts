import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-share-url-modal',
  templateUrl: './share-url-modal.component.html',
  styleUrls: ['./share-url-modal.component.scss'],
})
export class ShareUrlModalComponent implements OnInit {

  @Input() url: string

  constructor(
    private modalController:ModalController
  ) { }

  async ngOnInit() {
    console.log(this.url)
  }

  onExit(data?) {
    this.modalController.dismiss(data)
  }
  async copy() {
    await Clipboard.write({
      url: this.url
    });
  }
}
