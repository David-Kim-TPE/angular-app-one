import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


enum overlay {
  on = 1,
  off = 0
}

@Injectable()

export class AnimateService {
  layer: overlay = overlay.off;
  msg: string;


  constructor() { }

  toggle(layer, msg = '') {
    this.layer = layer;
    this.msg = msg;
  }

  isOn() {
    return this.layer === overlay.on;
  }
}
