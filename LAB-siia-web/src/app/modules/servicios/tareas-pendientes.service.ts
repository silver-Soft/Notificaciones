import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareasPendientesService {
  
  private tareasPendientesSource = new BehaviorSubject<any>(null);
  tareasPendientes = this.tareasPendientesSource.asObservable();
  
  constructor() { }

  setTareasPendientes(tareasPendientes: any[]) {
    this.tareasPendientesSource.next(tareasPendientes);
  }
}
