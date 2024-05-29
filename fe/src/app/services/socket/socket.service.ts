import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }

  connectToServer() {
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });
  }

  sendMessage(eventName: string, message: string) {
    this.socket.emit(eventName, {
      message
    });
  }

  getMessage(eventName: string) {
    return new Observable(observer => {
      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });
    });
  }
}
