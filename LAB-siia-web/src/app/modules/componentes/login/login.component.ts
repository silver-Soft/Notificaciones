import { Component, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { NotificationService } from 'src/app/modules/servicios/core/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginUsuarioService } from '../../servicios/login-usuario.service'; 
import { ServicioNavBarService } from '../../servicios/servicio-nav-bar.service';
import { AvisoDatosPersonalesDialogComponent } from '../modal-dialogs/aviso-datos-personales-dialog/aviso-datos-personales-dialog.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TareasPendientesService } from '../../servicios/tareas-pendientes.service';
import { SharedService } from '../../servicios/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output()
  hide = true;
  logueoData:any;
  objeto:any
  objetoExtra:any
  listPrivilegios: any;

  datosLogueoFormGroup= this._formBuilder.group({
    usuario: new FormControl('',[Validators.required]),
    contrasena: new FormControl('',[Validators.required]),
  });  
  esDispositivoMovil: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _notificationService: NotificationService,
    private _router: Router,
    public _dialog: MatDialog,
    private _translate: TranslateService,
    private _loginUsuarioService: LoginUsuarioService,
    private servicioNavBar: ServicioNavBarService,
    private tareasPendientesService: TareasPendientesService,
    private observer : BreakpointObserver,
    private sharedService: SharedService,
  ){ }

  ngOnInit(): void {
    this.observer.observe(['(max-width : 800px)']).subscribe((res) => {
      
      if (res.matches){
        this.esDispositivoMovil = true
      } else {
        this.esDispositivoMovil = false
      }
    });
  }

  formSubmit() {
    if(this.datosLogueoFormGroup.valid){
      this.logueoUsuario();
    }
  }

  logueoUsuario() {
    if(this._loginUsuarioService.obtenerToken()){
      console.log("tiene token")
      this._notificationService.pushSuccess("Bienvenido "+this.objeto.strNombreCompleto)

        //dirigir usario al inicio
      this._router.navigate(['inicio'])
    }else{
      console.log("NO tiene token")
      const usuario = { 
        strUsuario: this.datosLogueoFormGroup.value.usuario, 
        strContrasena: this.datosLogueoFormGroup.value.contrasena 
      };

      this._loginUsuarioService.UsuarioLogueo(usuario).subscribe((data: any) => {
        this.logueoData = data;          

        if(this.logueoData.blnValido == true){       
            sessionStorage.clear();
            localStorage.clear();       

            this.objeto=this.logueoData.objeto; 
            this.listPrivilegios= this.logueoData.listPrivilegios
            this.objetoExtra= this.logueoData.objetoExtra;              

            sessionStorage.setItem("strNombreCompleto",this.objeto.strNombreCompleto);
            sessionStorage.setItem("strLoginUsuarioLog",this.objeto.strLoginUsuarioLog);
            sessionStorage.setItem("lngIdPersona",this.objeto.lngIdPersona);
            sessionStorage.setItem("token",this.objeto.token);
            sessionStorage.setItem("listPrivilegios",this.objeto.listPrivilegios);
            sessionStorage.setItem("idHistorialAcademico",this.objeto.idHistorialAcademico)

            let infoCarousel ={
              blnUsuarioMsCreado: this.objeto.blnUsuarioMsCreado,
              blnUsuarioMsExistente: this.objeto.blnUsuarioMsExistente,
              blnEsCumpleanios: this.objeto.blnEsCumpleanios,
              blnUsuarioGmCreado: this.objeto.blnUsuarioGmCreado,
              blnUsuarioGmExistente: this.objeto.blnUsuarioGmExistente,
              strCorreoInstitucional: this.objeto.strCorreoInstitucional,
              strCorreoInstitucionalGm: this.objeto.strCorreoInstitucionalGm,
            }
            sessionStorage.setItem("infoCarousel",JSON.stringify(infoCarousel));
            this.servicioNavBar.triggerPrivilegios.emit(this.objeto.listPrivilegios)
            this.servicioNavBar.triggerCarousel.emit(infoCarousel)
            this.sharedService.setSharedAvisosData(this.logueoData.objetoExtraTres)
            this.tareasPendientesService.setTareasPendientes(this.logueoData.objetoExtraDos?.lstMensajesValidacion.length>0?this.logueoData.objetoExtraDos?.lstMensajesValidacion:[]/*messages*/)
            sessionStorage.setItem("listTareasPendientes",JSON.stringify(this.logueoData.objetoExtraDos?.lstMensajesValidacion.length>0?this.logueoData.objetoExtraDos?.lstMensajesValidacion:[]/*messages*/));
            this._router.navigate(['inicio'])    
            this._notificationService.pushSuccess("Bienvenido "+this.objeto.strNombreCompleto)
        }
        for(let obj of this.logueoData.lstMensajes){
          this._notificationService.pushError(obj.mensaje)
        }
      });
    }
  }

  revisarError = (formGroup: FormGroup, controlName: string, errorName: string) => {
    return formGroup.controls[controlName].hasError(errorName);
  }

  soloNumeros(event:any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }  

  openAvisoDatosPersonalesDialog(){
    var dimen="100%"
    if(this.esDispositivoMovil){
      dimen="100%"
    }else{
      dimen="60%"
    }
    const dialogRef = this._dialog.open(AvisoDatosPersonalesDialogComponent, {
      data: {
        titulo:"Aviso de protección de datos personales",        
      },  
      height: 'auto',
      width: dimen        
    });
  }
  chat(){
    window.open("https://siia.uatx.mx:8743/siiaboot-chat/", "GarzaBoot", "width=500, height=700")
  }
}
