export class Notification {

    id: number;
    message: String;
    severityClass: String;
    
    constructor(message: String, severityClass: String){
        this.message = message;
        this.severityClass = severityClass;
        this.id = (new Date()).getTime();
    }
    
}