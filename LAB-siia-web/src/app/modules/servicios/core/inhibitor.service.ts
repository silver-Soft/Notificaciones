import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Inhibitor } from '../../classes/Inhibitor';

@Injectable({
  providedIn: 'root'
})
export class InhibitorService {

  private loaderSubject = new Subject<Inhibitor>();
  loaderState = this.loaderSubject.asObservable();

  constructor() {}

  show() {
    this.loaderSubject.next(<Inhibitor>{show: true});
  }

  hide() {
    this.loaderSubject.next(<Inhibitor>{show: false});
  }

}
