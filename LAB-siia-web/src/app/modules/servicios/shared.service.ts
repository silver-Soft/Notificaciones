import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sharedData: string;
  sharedEventData: string;
  convocatoriaData: string
  avisosData: any;

  constructor() { }
  setSharedAvisosData(data: string) {
    this.avisosData = data;
  }
  // Método para obtener los datos compartidos
  getSharedAvisosData(): string {
    return this.avisosData;
  }
}
