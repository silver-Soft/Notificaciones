import { HttpHeaders } from '@angular/common/http';

export class AppSettings {

    public static env ="https://siia5"
    public static API_ENDPOINT = AppSettings.env+'.uatx.mx:8743';
    public static API_ENDPOINT_AVISOS= AppSettings.env+'.uatx.mx:8743/siia-back-avisos-0.0.1-SNAPSHOT'
    public static API_ENDPOINT_FCM = 'https://siia-fcm-service-495517142799.us-central1.run.app/';//http://localhost:8080

    public static TITLE = 'SIIA 5';
    public static SLOGAN = 'Sistema integral de información administrativa';
    public static COPYRIGHT = 'Copyright © 2022 - Todos los derechos reservados';

    public static TOKEN_USER = "token";
    public static LOGGED_USER = "loggedUser"; 
    public static OPTIONS_LOGGED_USER = "optionsLoggedUser";

   
    public static CODE_LOST_REQUEST = 0;
    public static CODE_WRONG_REQUEST = 400;
    public static CODE_WITHOUT_AUTHORIZATION = 401;
    public static CODE_OK = 200;

    public static HEADERS = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
          })
    };
}
