import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  titulo:string  
}

@Component({
  selector: 'app-aviso-datos-personales-dialog',
  templateUrl: './aviso-datos-personales-dialog.component.html',
  styleUrls: ['./aviso-datos-personales-dialog.component.css'],
  styles:[`
    ::ng-deep .mat-dialog-container {
      box-shadow: 0px 11px 15px -7px rgba(255, 255, 255, 0), 0px 24px 38px 3px rgba(255, 255, 255, 0), 0px 9px 46px 8px rgba(255, 255, 255, 0);
      background: transparent;
      color: rgba(0,0,0,.87);
      padding: 0px;
    }   
  `] 
})
export class AvisoDatosPersonalesDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AvisoDatosPersonalesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
