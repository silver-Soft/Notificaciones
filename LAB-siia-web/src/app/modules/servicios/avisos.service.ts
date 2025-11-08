import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { NotificationService } from "./core/notification.service";
import { AppSettings } from 'src/app/settings.const';
import { catchError, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class AvisosService {
    token = sessionStorage.getItem("token");
    constructor(private https: HttpClient,protected _notificationService: NotificationService,
      private _translate: TranslateService) {}
    

      obtenerEstatusAvisos = () => {
        const headers = new HttpHeaders({'Authorization':'Bearer '+ this.token});
        return this.https
          .get(AppSettings.API_ENDPOINT_AVISOS + '/api/avisos/obtEstatus', {
            headers: headers,
          })
          .pipe(
            catchError((error) => {
              console.log(error);
              return this.handleError(error);
            })
          );
      };

      buscarAvisos(body:any) {        
        const headers = new HttpHeaders({'Authorization':'Bearer '+this.token});
        return this.https.post(
          AppSettings.API_ENDPOINT_AVISOS + '/api/avisos/busquedaAvisos',
          body,{ headers: headers }
        ).pipe(
          catchError(error => {
            console.log(error);
            return this.handleError(error);
          })
        );
      }

      consultarAviso(Body:any) {
        const headers = new HttpHeaders({'Authorization':'Bearer '+this.token});
          return this.https.put(AppSettings.API_ENDPOINT_AVISOS + '/api/avisos/mostrarAvisos', 
          Body,{ headers: headers }).pipe(
            catchError(error => {
              console.log(error);
              return this.handleError(error);
            })
          ).pipe(
            catchError(error => {
              console.log(error);
              return this.handleError(error);
            })
          );
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
            this._notificationService.pushMsjResponse(error.error.lstMensajes);
          }
        }
    
        return throwError('ERROR');
      }

    }