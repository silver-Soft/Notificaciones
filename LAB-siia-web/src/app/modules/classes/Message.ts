export class Message {

    id: number;
    message: String;
    severity: number;
    
    constructor(message: String, severity: number){
        this.message = message;
        this.severity = severity;
        this.id = (new Date()).getTime();
    }
    
}