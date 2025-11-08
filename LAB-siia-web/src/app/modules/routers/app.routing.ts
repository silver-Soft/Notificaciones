import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from "../servicios/core/auth-guard.service";

//LOGIN
import { LoginComponent } from '../componentes/login/login.component';
import { HomeComponent } from '../componentes/home/home.component';
import { AdminNotificacionesComponent } from '../componentes/admin-notificaciones/admin-notificaciones.component';

const routes: Routes = [
  { path: "", redirectTo: 'login', pathMatch: "full"},
  { path: "login", component: LoginComponent, pathMatch: "full"},
  { path: "inicio", component: HomeComponent, pathMatch: "full", canActivate:[AuthGuardService]}, 
  { path: "notificaciones", component: AdminNotificacionesComponent, pathMatch: "full", canActivate:[AuthGuardService]}, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { };
