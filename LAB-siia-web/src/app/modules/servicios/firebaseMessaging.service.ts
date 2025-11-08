import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { NotificationService } from "./core/notification.service";
import { AppSettings } from 'src/app/settings.const';
import { catchError, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class FirebaseMessagingService {

    constructor(private https: HttpClient,protected _notificationService: NotificationService,
      private _translate: TranslateService) {}
    
      sendToTopic(body:any) {                
        return this.https.post(
          AppSettings.API_ENDPOINT_FCM + '/api/v1/notifications/send/topic',
          body,{ }
        ).pipe(
          catchError(error => {
            console.log(error);
            return this.handleError(error);
          })
        );
      }

      sendToToken(body:any) {                
        return this.https.post(
          AppSettings.API_ENDPOINT_FCM + '/api/v1/notifications/send/token',
          body,{ }
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
          }
        }
    
        return throwError('ERROR');
      }

    }