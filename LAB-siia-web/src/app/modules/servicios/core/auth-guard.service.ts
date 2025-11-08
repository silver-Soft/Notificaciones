import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LoginUsuarioService } from '../login-usuario.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService {
constructor(
    private _loginService: LoginUsuarioService,
    private _router: Router,
    private _notificationService:NotificationService,
    private _translate: TranslateService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    if (this._loginService.obtenerToken()) {
      return true;
    }
    
    this._notificationService.pushAlert('¡Su sesión ha expirado. Inicie sesión para hacer uso del sistema!')
    this._router.navigate(['login']);
    
    return false;
  }
}

