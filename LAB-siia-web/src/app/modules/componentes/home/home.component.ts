import { Component, OnInit,ChangeDetectionStrategy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { TareasPendientesService } from '../../servicios/tareas-pendientes.service';
import { Router } from '@angular/router';

import { BreakpointObserver } from '@angular/cdk/layout';
import { ServicioNavBarService } from '../../servicios/servicio-nav-bar.service';
import { LoginUsuarioService } from '../../servicios/login-usuario.service';
import { TemplateComponent } from '../core/template/template.component';
import * as confetti from 'canvas-confetti';
import { SharedService } from '../../servicios/shared.service';
import { AvisosComponent } from '../modal-dialogs/home/avisos/avisos.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  items: any[]= [];
imagen: string="assets/imagenes/cumpleaniosSIIA.png"
@ViewChild('tarjeta', {static: true}) tarjetaRef: ElementRef;
  exploding = false;
  showMessages:boolean=false
  panelOpenState = false;
  lstMensajesValidacion:any[]=[]
  esDispositivoMovil: boolean;
  listaPrivilegios: any;
  cumpleAnios: boolean;
  permiteAyuda: boolean;
  avisos: any;
  constructor(private tareasPendientesService: TareasPendientesService,
    private observer : BreakpointObserver,
    private servicioNavBar: ServicioNavBarService,
    public _loginUsuarioService: LoginUsuarioService,
    private templateComponente: TemplateComponent,
    private sharedService: SharedService, public dialog: MatDialog, public router: Router) { 
      this.observer.observe(['(max-width: 800px)']).subscribe(result => {
        this.esDispositivoMovil = result.matches;
      });
    }

  ngOnInit(): void {
    this.avisos = this.sharedService.getSharedAvisosData()!=undefined?
      this.sharedService.getSharedAvisosData():{lstAvisosSiia:[]};    
    this.showAvisos(this.avisos)
    var infoCarousel = sessionStorage.getItem("infoCarousel")!=null?
                        sessionStorage.getItem("infoCarousel") : null; 

    if(infoCarousel!=null){//si recarga
      var datosCarousel = JSON.parse(infoCarousel) 
      this.setearInfoCarousel(datosCarousel)         
    }
    else{
      this.servicioNavBar.triggerCarousel.subscribe(datosCarousel => {//si inicia sesion
        this.setearInfoCarousel(datosCarousel)   
      })
      
    } 
    this.tareasPendientesService.tareasPendientes.subscribe(mensajes => {
      let origen = ""
      if(mensajes?.length<1 || mensajes==null|| mensajes==undefined){
        this.showMessages=false

        let messages = sessionStorage.getItem('listTareasPendientes')!
        this.lstMensajesValidacion=JSON.parse(messages)
        if(this.lstMensajesValidacion.length>0){
          this.showMessages=true
          origen ="Tareas pendientes del sesionStorage...."
        }
      }else{
        this.showMessages=true
        this.lstMensajesValidacion = mensajes
        origen="Tareas pendientes del login...."
      }            
    })     
  }

  showAvisos(avisos: any) {
    if(avisos.lstAvisosSiia.length>0){
      this.consultarAviso(avisos.lstAvisosSiia)
    }else{
      console.log("No hay avisos del shared service...")
    }
  }

  consultarAviso(lstAvisosSiia:any[]){    
    if(this.esDispositivoMovil){
      //console.log("es dispositivo movil")
      const dialogConfig = {
        width: '100%', // Ancho del diálogo
        height: '100%', // Altura del diálogo      
        maxWidth: '100%', // Ancho máximo del diálogo
        maxHeight: '100%', // Altura máxima del diálogo
        panelClass: 'full-screen-dialog', // Clase de CSS para el diálogo de pantalla completa
        autoFocus: false, // Desactivar el enfoque automático en el primer elemento
        position:{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        },
        // Resto de opciones para el MatDialog
        data:{
          titulo:"Avisos",
          lstAvisosSiia: lstAvisosSiia
        }
      };
  
      const dialogRef = this.dialog.open(AvisosComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined){
          if(result.data==true){
            
          }else{
            
          }
        }
      });  

    }else{    
      const dialogRef = this.dialog.open(AvisosComponent, {
        data: {
          titulo:"Avisos",
          lstAvisosSiia: lstAvisosSiia   
        },   
        height: '100%',        
        width: '70%'         
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined){
          if(result.data==true){
            
          }else{
            
          }
        }
      });
    } 
  }

  setearInfoCarousel(info:any) {
    var privilegios = this._loginUsuarioService.obtenerPrivilegios()      
    this.listaPrivilegios = JSON.parse(JSON.stringify(privilegios))

    this.cumpleAnios = this.templateComponente.tienePrivilegio("cumpleanios")//info.blnEsCumpleanios?true:false;    
    this.permiteAyuda = this.templateComponente.tienePrivilegio("SolicitarServicio")
    if(info.blnUsuarioMsExistente){
      this.items.push(
        {
          show: info.blnUsuarioMsExistente,
          img:'https://uatx.mx/siia/avisoCuentaCorreo.jpg',
          proveedorUrl: 'https://login.microsoftonline.com/ ',
          correo: info.strCorreoInstitucional,
          imgAyuda:'https://siiadsyti.uatx.mx:8743/SIIA/resources/imagenes/aviso_mesa_ayuda.png',
          //showAyuda: permiteAyuda,
        }
      )
    }
    if(info.blnUsuarioGmExistente){
      this.items.push(
        {
          show: info.blnUsuarioGmExistente,
          img: 'https://uatx.mx/siia/avisoCuentaCorreoGmail.jpg',
          proveedorUrl: 'https://www.google.com/gmail/',
          correo: info.strCorreoInstitucionalGm,  
          imgAyuda:'https://siiadsyti.uatx.mx:8743/SIIA/resources/imagenes/aviso_mesa_ayuda.png',
        }
      )
    }
  }
  onMouseEnter(){
    let element = document.getElementById('tarjeta');
    if(this.cumpleAnios){      
      if (element) {
        element.classList.add('mostrado');
      }else{
        console.log("No se encontro el id")
      }
      this.lanzarConfetti()
    }
  }

  stripHtml(html: string): string {
    const temporalDivElement = document.createElement('div');
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || '';
  }
  
  openNewTab(url: string) {
    localStorage.clear();
    sessionStorage.clear();      
    //this.sidenav.close();  
    this.router.navigateByUrl('/login').then(() => {
      window.location.reload()     
    })  
    window.open(url, '_blank');
  }
  mesaDeAyuda(){
    this.router.navigate(['#'],{})
  }
  lanzarConfetti(){
    const canvasElement = document.getElementById('canvas');
    if (canvasElement instanceof HTMLCanvasElement) {
        confetti.create(canvasElement, {
            resize: true,
            useWorker: true
        })({ particleCount: 500, spread: 130 });
    } else {
        console.error('El elemento de lienzo no se encontró o no es un elemento de lienzo HTML.');
    }
  }
}
