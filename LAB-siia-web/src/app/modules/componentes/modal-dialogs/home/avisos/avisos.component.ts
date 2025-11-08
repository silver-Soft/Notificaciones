import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {  
  titulo:string,
  lstAvisosSiia:any[]
}

@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.css'],
  styles:[`
    ::ng-deep .mat-dialog-container {
      box-shadow: 0px 11px 15px -7px rgba(255, 255, 255, 0), 0px 24px 38px 3px rgba(255, 255, 255, 0), 0px 9px 46px 8px rgba(255, 255, 255, 0);
      background: transparent;
      color: rgba(0,0,0,.87);
      padding: 0px;
    }   
  `],
})
export class AvisosComponent implements OnInit {
  result: boolean=false;
  lstAvisosSiia: any[]=[];
  panelOpenState = false;

  constructor(public dialogRef: MatDialogRef<AvisosComponent>,    
    @Inject(MAT_DIALOG_DATA) public data: DialogData,    
    private observer : BreakpointObserver) { }

  ngOnInit(): void {
    this.lstAvisosSiia=this.data.lstAvisosSiia
  }

  onNoClick(): void {
    this.dialogRef.close({data:this.result});
  }    
}
