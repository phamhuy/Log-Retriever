import { Injectable } from '@angular/core';
import { Server } from '@models';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  servers: Server[];

  constructor() {
    this.servers = [
      { name: 'app-sti', url: '' },
      { name: 'app-sti2', url: '' },
      { name: 'qa-sti', url: '' }
    ]
  }
}