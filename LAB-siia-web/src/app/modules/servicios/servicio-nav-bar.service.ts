import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioNavBarService {

  @Output() triggerPrivilegios: EventEmitter<any> = new EventEmitter()
  @Output() triggerCarousel: EventEmitter<any> = new EventEmitter()
  @Output() triggerVolver: EventEmitter<any> = new EventEmitter()
  constructor() { }
}
