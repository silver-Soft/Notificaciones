import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseMessagingService } from 'src/app/modules/servicios/firebaseMessaging.service';
import { NotificationService } from 'src/app/modules/servicios/core/notification.service';

@Component({
  selector: 'app-admin-notificaciones',
  templateUrl: './admin-notificaciones.component.html',
  styleUrls: ['./admin-notificaciones.component.css']
})
export class AdminNotificacionesComponent {

  nuevaNotificacionFormGroup: FormGroup;

  tipoNotificacion: string = 'global';

  constructor(private _formBuilder: FormBuilder,
    private fcmService: FirebaseMessagingService,
    private notificacionesService: NotificationService
  ) {
    this.nuevaNotificacionFormGroup = this._formBuilder.group({
      messageTitle: new FormControl('', [Validators.required]),
      messageBody: new FormControl('', [Validators.required]),
      //areaCampus: new FormControl('',[Validators.required]),
      /**
       * 1.- Dependiendo del area o campus, en un futuro se pueden
       * obtener los temas que estan registrados en ese campus 
       * */
      notificacionGlobal: new FormControl(true, [Validators.required]),
      notificacionIndividual: new FormControl(false, [Validators.required]),
      /**1.- Si la notificacion individual esta activa, se habilita 
       * un campo de busqueda de alumnos por nombre o matricula para poder
       * seleccionarlo y obtener su targetToken */
      targetTopic: new FormControl('', [Validators.required]),
      //programacion: new FormControl('',[Validators.required]),
      targetToken: new FormControl('', [Validators.nullValidator]),
    });
  }
  ngOnInit(): void {
    this.nuevaNotificacionFormGroup.get('notificacionIndividual')?.disable();
    this.nuevaNotificacionFormGroup.get('targetTopic')?.disable();
    this.nuevaNotificacionFormGroup.get('targetToken')?.disable();

    this.nuevaNotificacionFormGroup.updateValueAndValidity();
    this.fieldListeners()
  }

  fieldListeners(): void {
    const globalCtrl = this.nuevaNotificacionFormGroup.get('notificacionGlobal');
    const individualCtrl = this.nuevaNotificacionFormGroup.get('notificacionIndividual');
    const topicCtrl = this.nuevaNotificacionFormGroup.get('targetTopic');
    const tokenCtrl = this.nuevaNotificacionFormGroup.get('targetToken');

    if (!globalCtrl || !individualCtrl || !topicCtrl || !tokenCtrl) return;

    // --- Listener para notificación global ---
    globalCtrl.valueChanges.subscribe((esGlobal: boolean) => {
      if (esGlobal) {
        this.tipoNotificacion = 'global';

        individualCtrl.disable({ emitEvent: false });
        topicCtrl.disable({ emitEvent: false });
        tokenCtrl.disable({ emitEvent: false });

        // Limpiar valores y validadores
        individualCtrl.setValue(false, { emitEvent: false });
        topicCtrl.setValue('', { emitEvent: false });
        tokenCtrl.setValue('', { emitEvent: false });

        topicCtrl.clearValidators();
        tokenCtrl.clearValidators();
      } else {
        // Habilitar el selector de tipo de notificación
        individualCtrl.enable({ emitEvent: false });

        // Aplicar la lógica del valor actual de notificacionIndividual
        const esIndividual = individualCtrl.value;

        if (esIndividual) {
          this.tipoNotificacion = 'individual';
          topicCtrl.disable({ emitEvent: false });
          tokenCtrl.enable({ emitEvent: false });

          tokenCtrl.setValidators([Validators.required]);
          topicCtrl.clearValidators();
        } else {
          this.tipoNotificacion = 'grupo';
          topicCtrl.enable({ emitEvent: false });
          tokenCtrl.disable({ emitEvent: false });

          topicCtrl.setValidators([Validators.required]);
          tokenCtrl.clearValidators();
        }
      }

      // Actualizar validez de todos los campos
      topicCtrl.updateValueAndValidity({ emitEvent: false });
      tokenCtrl.updateValueAndValidity({ emitEvent: false });
    });

    // --- Listener para notificación individual ---
    individualCtrl.valueChanges.subscribe((esIndividual: boolean) => {
      if (globalCtrl.value) return; // si es global, no hacer nada

      if (esIndividual) {
        this.tipoNotificacion = 'individual';
        topicCtrl.disable({ emitEvent: false });
        tokenCtrl.enable({ emitEvent: false });

        tokenCtrl.setValidators([Validators.required]);
        topicCtrl.clearValidators();
        topicCtrl.setValue('', { emitEvent: false });
      } else {
        this.tipoNotificacion = 'grupo';
        topicCtrl.enable({ emitEvent: false });
        tokenCtrl.disable({ emitEvent: false });

        topicCtrl.setValidators([Validators.required]);
        tokenCtrl.clearValidators();
        tokenCtrl.setValue('', { emitEvent: false });
      }

      topicCtrl.updateValueAndValidity({ emitEvent: false });
      tokenCtrl.updateValueAndValidity({ emitEvent: false });
    });
  }


  enviarNotificacion() {
    if (this.nuevaNotificacionFormGroup.valid) {
      const payload = this.nuevaNotificacionFormGroup.value;
      console.log("Payload a enviar: ", JSON.stringify(payload));

      if (this.tipoNotificacion === 'global') {
        payload.targetTopic = "test_notificaciones";
        this.sendToTopic(payload);//El servicio de envío global ya esta en producción, usamos el topic de prueba.
      } 
      else if (this.tipoNotificacion === 'grupo') {
        this.sendToTopic(payload);
      } 
      else if (this.tipoNotificacion === 'individual') {
        this.sendToToken(payload);
      }
    } else {
      this.notificacionesService.pushError('Por favor, complete todos los campos requeridos.');
    }
  }

  

  sendToTopic(payload: any) {
    this.fcmService.sendToTopic(payload).subscribe({
      next: data => {
        console.log("Respuesta del servicio FCM: ", data);
        this.notificacionesService.pushSuccess('Notificación de grupo enviada correctamente.');
      },
      error: error => {
        this.notificacionesService.pushError("ha ocurrido un error, vuelva a intentarlo más tarde")
      }
    });
  }
  sendToToken(payload: any) {
    this.fcmService.sendToToken(payload).subscribe({
      next: data => {
        console.log("Respuesta del servicio FCM: ", data);
        this.notificacionesService.pushSuccess('Notificación individual enviada correctamente.');
      },
      error: error => {
        this.notificacionesService.pushError("ha ocurrido un error, vuelva a intentarlo más tarde")
      }
    });
  }

  //Lista de alumnos de prueba con [targetToken] -> Este se debe obtener de la DB, Esta en proceso..
  //Puedes obtener el targetToken al logearte en la app movil y revisar el Logcat de Android Studio, buscando la salida TOKEN LOGIN
  alumnos = [
    {
      "nombre": "Ubaldo",
      "apPaterno": "Chantaca",
      "apMaterno": "Cerón",
      "nombreCompleto": "Ubaldo Chantaca Cerón",
      "matricula": "A001",
      "targetToken": "fEkB5Jc-QHyD6GaTp093q7:APA91bGrBksCScUDq5-AWaXbzuUD7dWlK1J1yt-kXkzucrR4YT1-nS_9T9PeSBsKGkvC_Ub8jKEcanUQOfVxNCyJaqJ2hQLPNwdYfoJR509jrN1VYclxCQU"
    },
    {
      "nombre": "Edilberto",
      "apPaterno": "Fuentes",
      "apMaterno": "Arana",
      "nombreCompleto": "Edilberto Fuentes Arana",
      "matricula": "A002",
      "targetToken": "fEkB5Jc-QHyD6GaTp093q7:APA91bGrBksCScUDq5-AWaXbzuUD7dWlK1J1yt-kXkzucrR4YT1-nS_9T9PeSBsKGkvC_Ub8jKEcanUQOfVxNCyJaqJ2hQLPNwdYfoJR509jrN1VYclxCQU"
    },
    {
      "nombre": "Jassyr",
      "apPaterno": "Juarez",
      "apMaterno": "Vazquez",
      "nombreCompleto": "Jassyr Juarez Vazquez",
      "matricula": "A003",
      "targetToken": "fEkB5Jc-QHyD6GaTp093q7:APA91bGrBksCScUDq5-AWaXbzuUD7dWlK1J1yt-kXkzucrR4YT1-nS_9T9PeSBsKGkvC_Ub8jKEcanUQOfVxNCyJaqJ2hQLPNwdYfoJR509jrN1VYclxCQU"
    },
    {
      "nombre": "Silvestre",
      "apPaterno": "López",
      "apMaterno": "Romano",
      "nombreCompleto": "Silvestre López Romano",
      "matricula": "A004",
      "targetToken": "cNcplT3kT8Gwwtq9Z-IvgT:APA91bGQIF7eh2z01bfy4Wn6zSkAwVVgaf1FGY9pq8WIJ8o2L9AuLhfM-hU87AlDGC7QZ9NmT4hpN962vouN2OoWE1HUTJljF1LczslBhMb-aZskDY1eQUU"
    },
    {
      "nombre": "Juan António",
      "apPaterno": "Olvera",
      "apMaterno": "Cruz",
      "nombreCompleto": "Juan António Olvera Cruz",
      "matricula": "A005",
      "targetToken": "fEkB5Jc-QHyD6GaTp093q7:APA91bGrBksCScUDq5-AWaXbzuUD7dWlK1J1yt-kXkzucrR4YT1-nS_9T9PeSBsKGkvC_Ub8jKEcanUQOfVxNCyJaqJ2hQLPNwdYfoJR509jrN1VYclxCQU"
    }
  ]

  //Temas ya existentes en FCM de prueba
  topics = [
    {
      targetTopic: "test_notificaciones",
      topic: "Integrantes de la MIS"
    }
  ];


}
