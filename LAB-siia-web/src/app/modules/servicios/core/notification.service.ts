import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/settings.const';
import { Notification } from '../../classes/Notification';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public listNotifications: Array<Notification> = Array<Notification>();

  constructor() { }
  //NOTIFICACIONES DE SWEET ALERT PARA PRUEBA 
  public pushSuccess(title:string, time?:number){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      timer: time? time: 5000,
      timerProgressBar: true,
    })
    Toast.fire({
      title: title,
      icon: 'success',
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,  
      confirmButtonText:'Aceptar',
      confirmButtonColor: '#009413',  
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }
  public pushError(title:any, time?:number){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      timer: time? time: 5000,
      timerProgressBar: true,
    })
    Toast.fire({
      title: title,
      icon: 'error',
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,  
      confirmButtonText:'Aceptar',
      confirmButtonColor: '#cb0000',
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      } 
    }) 
  }
  
  public pushAlert(title:any){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      timer: 5000,
      timerProgressBar: true,
    })
    Toast.fire({
      title: title,
      icon: 'warning',
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,  
      confirmButtonText:'Aceptar',
      confirmButtonColor: '#FF5733',
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }
  public pushInfo(title:any, time?:number){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      timer: time? time: 5000,
      timerProgressBar: true,
    })
    Toast.fire({
      title: title,
      icon: 'info',
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,  
      confirmButtonText:'Aceptar',
      confirmButtonColor: '#00d4ff',
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }
  public pushQuestion(title:any){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      timer: 5000,
      timerProgressBar: true,
    })
    Toast.fire({
      title: title,
      icon: 'question',
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,  
      confirmButtonText:'Aceptar',
      confirmButtonColor: '#759c79',
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }

  public pedirConfirmacion(titulo:string, contenido:string){
    return new Promise((resolve, reject) =>{
      Swal.fire({
        title: titulo,
        text: contenido,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then(result => {
        if (result.value) {
          resolve(true); // Valor de retorno cuando se hace clic en "Sí"
        } else {
          resolve(false); // Valor de retorno cuando se hace clic en "No" o se cierra el Swal
        }
      })
      .catch(error => {
        reject(error); // En caso de que ocurra algún error
      });
    })    
  }
  
  public toastCustomize(position:any,        colorTitulo:any,
    title:any,               time:number,          backgroundToast:any,
    progressBar:boolean,     icon:any,             iconColor:any,
    showDenyButton:boolean,  denyButtonText:any,   denyButtonColor:any, 
    showCancelButton:boolean,cancelButtonText:any, cancelButtonColor:any,
    showConfirmButton:any,   confirmButtonText:any,confirmButtonColor:any,                                                        
    ){

    const Toast = Swal.mixin({
      toast: true,
      position: position,
      timer: time,
      timerProgressBar: progressBar,
      background: backgroundToast,
    })
    Toast.fire({
      title: title,
      icon: icon,//success , error , warning , info , question
      iconColor: iconColor,
      showDenyButton: showDenyButton,
      denyButtonColor: denyButtonColor,
      denyButtonText: denyButtonText,

      showCancelButton: showCancelButton,
      cancelButtonColor: cancelButtonColor,
      cancelButtonText: cancelButtonText,

      showConfirmButton: showConfirmButton,  
      confirmButtonColor: confirmButtonColor,
      confirmButtonText:confirmButtonText,

      color: colorTitulo,    
    }).then((result) => {
      if (result.isConfirmed) {          
        
      }else if(result.isDismissed){
        
      }
    }) 
  }  

}
