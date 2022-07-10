import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket  {


    // constructor() {
    //   super({ url: 'https://api.fastworld.app', options: {autoConnect: false}});
    // }

}
