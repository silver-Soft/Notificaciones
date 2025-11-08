import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/settings.const';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NotificationService } from './core/notification.service';
import { catchError, Observable, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoginUsuarioService {

  constructor(
    private _http: HttpClient,
    protected _notificationService: NotificationService,
    private _translate: TranslateService
  ) { }

  //logueo
  UsuarioLogueo(usuario:any): Observable<any> {
    return this._http.post(
      AppSettings.API_ENDPOINT + '/siia-back-comun-0.0.1-SNAPSHOT/public/serviciosUniversitarios/authenticate',usuario
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  guardarToken(token:string){
    return sessionStorage.setItem("token",token)
  }

  obtenerToken() { 
    return sessionStorage.getItem("token")
  }
  
  obtenerPrivilegios() { 
    var privilegios = sessionStorage.getItem("listPrivilegios") 
    let arr
    if(privilegios != null && privilegios != undefined){
      privilegios = privilegios.replace("[", "");
      privilegios = privilegios.replace("]", "");
      privilegios = privilegios.split(/\s+/).join('');
      privilegios = privilegios.replace(/[ '"]+/g, ' ');
      
      arr = privilegios.split(','); 
    }    
    return arr//sessionStorage.getItem("listPrivilegios")
  }

  obtenerNombreCompleto() { 
    return sessionStorage.getItem('strNombreCompleto'); 
  } 

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      this._notificationService.pushError(this._translate.instant('template.notificaciones.error.comunicacion'));
    } else {
      if (error.status === AppSettings.CODE_WRONG_REQUEST) {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.solicitudErronea'));
      } else if (error.status === AppSettings.CODE_WITHOUT_AUTHORIZATION) {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.solicitudNoAutorizada'));
      } else {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.intentaloMasTarde'));
      }
    }

    return throwError('ERROR');
  }
}
