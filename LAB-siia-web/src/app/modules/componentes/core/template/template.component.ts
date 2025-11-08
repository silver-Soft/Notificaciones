import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoginUsuarioService } from 'src/app/modules/servicios/login-usuario.service';
import { FormControl } from '@angular/forms';
import { ServicioNavBarService } from 'src/app/modules/servicios/servicio-nav-bar.service';

//traductor
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
  styles: [`
    ::ng-deep .arrowColor > .mat-expansion-indicator:after {
      color: white;
    }
    ::ng-deep .parametersPanel .mat-expansion-panel-header {
      padding: 5px !important;
    }  
    ::ng-deep .parametersPanel .mat-expansion-panel-body {
      padding: 0 0px 16px !important;
    }  
    ::ng-deep .mat-expansion-panel-body {
      padding: 0 0px 0px 0px !important;
    }  
    ::ng-deep .mat-expansion-panel-header-title, .mat-expansion-panel-header-description {
      flex-grow: 0 !important;
    }  
  `]
})
export class TemplateComponent implements OnInit {
  panelOpenState1 = false;
  panelOpenState2 = false;
  selectedSubButton: number
  posSelectButton: number

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  esDispositivoMovil: boolean = false;

  public activeLang = 'es';
  selected = new FormControl('es');
  listaPrivilegios: any;
  //adminCongresos: boolean = false;
  constructor(public _loginUsuarioService: LoginUsuarioService,
    private translate: TranslateService,
    private observer: BreakpointObserver,
    public router: Router,
    private servicioNavBar: ServicioNavBarService) { }

  ngOnInit(): void {
    this.translate.setDefaultLang(this.activeLang);

    if (this._loginUsuarioService.obtenerPrivilegios()) {//si recarga pagina
      var privilegios = this._loginUsuarioService.obtenerPrivilegios()
      console.log("Recibiendo privilegios del storage...")
      this.listaPrivilegios = JSON.parse(JSON.stringify(privilegios))
    }
    else {
      this.servicioNavBar.triggerPrivilegios.subscribe(privilegios => {//si inicia sesion
        console.log("Recibiendo privilegios del Login...")
        this.listaPrivilegios = privilegios
      })

    }
    this.observer.observe(['(max-width : 800px)']).subscribe((res) => {

      if (res.matches) {
        this.esDispositivoMovil = true
      } else {
        this.esDispositivoMovil = false
      }
    });
  }


  //observer para menu lateral
  ngAfterViewInit(): void {
    this.servicioNavBar.triggerVolver.subscribe(back => {//si inicia sesion
      if (back == "backToHome") {
        this.selectedSubButton = 0
      }
    })
  }

  public tienePrivilegio(priv: string) {
    var cuentaConPrivilegio = false
    if (priv == "TODO") {
      cuentaConPrivilegio = true
    }
    this.listaPrivilegios.forEach((privilegio: string) => {
      if (privilegio == priv) {
        cuentaConPrivilegio = true
      }
    });
    return cuentaConPrivilegio
  }

  public changeLang(lang: any) {
    this.activeLang = lang;
    this.translate.use(lang);
  }

  click_iniciarSesion() {
    this.sidenav.close();
    this.router.navigateByUrl('/login')
  }

  CerrarSesion() {
    localStorage.clear();
    sessionStorage.clear();

    this.sidenav.close();

    this.router.navigateByUrl('/login')
      .then(() => {
        window.location.reload()
      })
  }

  bindSelected(position: number, SubButtonPos: number) {
    this.sidenav.close();
    this.selectedSubButton = SubButtonPos
    this.posSelectButton = position
  }

  closeMenu() {
    this.sidenav.close();
  }
}
