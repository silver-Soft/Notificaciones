import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';

// ngx-translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// ngrx-pdf-viewer
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
// routers
import { AppRoutingModule } from './modules/routers/app.routing'; //router principal
// otros
import { MatPaginatorModule } from '@angular/material/paginator';
// componentes
import { TemplateComponent } from './modules/componentes/core/template/template.component'; 
import { InhibidoraComponent } from './modules/componentes/core/inhibidora/inhibidora.component';
import { LoaderInterceptorService } from './modules/componentes/core/interceptores/inhibidora.interceptor'; 
import { ModalConfirmacionComponent } from './modules/componentes/core/modal-confirmacion/modal-confirmacion.component'; 
import { PiePaginaComponent } from './modules/componentes/core/template/pie-pagina/pie-pagina.component'; 
import { SafeUrlPipe } from './modules/componentes/core/pipes/safe-url.pipe'; 

import { LoginComponent } from './modules/componentes/login/login.component'; 
import { HomeComponent } from './modules/componentes/home/home.component'; 
import { AvisoDatosPersonalesDialogComponent } from './modules/componentes/modal-dialogs/aviso-datos-personales-dialog/aviso-datos-personales-dialog.component'; 
import { AvisosComponent } from './modules/componentes/modal-dialogs/home/avisos/avisos.component';
import { AdminNotificacionesComponent } from './modules/componentes/admin-notificaciones/admin-notificaciones.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    InhibidoraComponent,
    ModalConfirmacionComponent,
    PiePaginaComponent,
    SafeUrlPipe,
    LoginComponent,
    HomeComponent,
    AvisoDatosPersonalesDialogComponent,
    AvisosComponent,
    AdminNotificacionesComponent,
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatMenuModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatGridListModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatStepperModule,
    MatRadioModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule,
    NgxExtendedPdfViewerModule,
    MatPaginatorModule,
    MatSliderModule,
    HammerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [ HttpClient ]
      }
    }),
  ],
  providers: [
    DatePipe,CurrencyPipe,{
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    },{
      provide: LocationStrategy, 
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent],
  schemas: [    
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
