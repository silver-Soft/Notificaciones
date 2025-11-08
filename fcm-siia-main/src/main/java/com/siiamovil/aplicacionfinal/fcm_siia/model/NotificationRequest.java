package com.siiamovil.aplicacionfinal.fcm_siia.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {

    // Contenido de la notificación
    private String messageTitle;
    private String messageBody;

    // Campos de destino (solo uno debe ser usado por request)
    // Usado por el endpoint /send/topic
    private String targetTopic;

    // Usado por el endpoint /send/token
    private String targetToken;

    // Usado por el endpoint /send/multiCastToken
    private List<String> listTokens;
}
