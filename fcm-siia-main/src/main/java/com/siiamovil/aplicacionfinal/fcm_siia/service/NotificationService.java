package com.siiamovil.aplicacionfinal.fcm_siia.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.*;
import com.siiamovil.aplicacionfinal.fcm_siia.model.NotificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio encargado de interactuar con Firebase Cloud Messaging (FCM).
 * Contiene la lógica para construir y enviar la carga útil a través de Firebase Admin SDK.
 */
@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private final FirebaseMessaging firebaseMessaging;

    // Tema fijo al que todos los usuarios deberían estar suscritos para recibir notificaciones generales
    private static final String GLOBAL_TOPIC = "notificaciones_generales";

    // Inyección del FirebaseApp configurado en FCMConfig.java
    public NotificationService(FirebaseApp firebaseApp) {
        // Obtenemos la instancia de FirebaseMessaging a partir de la App
        this.firebaseMessaging = FirebaseMessaging.getInstance(firebaseApp);
    }

    /**
     * Procesa la solicitud y envía un mensaje a un tema específico de FCM.
     *
     * @param request Datos de la notificación a enviar.
     * @return El ID del mensaje enviado por Firebase.
     */
    public String sendTopicNotification(NotificationRequest request) {
        // 1. Construir la notificación visible
        Notification notification = Notification.builder()
                .setTitle(request.getMessageTitle())
                .setBody(request.getMessageBody())
                //configurar icono y sonido si es necesario en el manifest
                .build();

        // 2. Construir el mensaje de FCM
        Message message = Message.builder()
                .setNotification(notification)
                .setTopic(request.getTargetTopic()) // Tema al que se enviará el mensaje
                .putData("source", "SIIA_ADMIN_WEB")
                .putData("dataType", "school_notice")
                .build();

        // 3. Enviar el mensaje
        try {
            String messageId = firebaseMessaging.send(message);
            logger.info("Notificación enviada con éxito al tema {}. ID de Mensaje: {}", request.getTargetTopic(), messageId);
            return messageId;
        } catch (Exception e) {
            logger.error("Error al enviar la notificación al tema {}", request.getTargetTopic(), e);
            throw new RuntimeException("Fallo en el envío de la notificación a Firebase.", e);
        }
    }

    /**
     * Envía una notificación a todos los usuarios (tema "notificaciones_generales").
     *
     * @param request Datos de la notificación a enviar.
     * @return El ID del mensaje enviado por Firebase.
     */
    public String sendGlobalNotification(NotificationRequest request) {
        // 1. Construir la notificación visible
        Notification notification = Notification.builder()
                .setTitle(request.getMessageTitle())
                .setBody(request.getMessageBody())
                .build();

        // 2. Construir el mensaje de FCM apuntando al tema global
        Message message = Message.builder()
                .setNotification(notification)
                .setTopic(GLOBAL_TOPIC) // Apunta al tema global
                .putData("source", "SIIA_ADMIN_WEB")
                .putData("dataType", "global_notice")
                .build();

        // 3. Enviar el mensaje
        try {
            String messageId = firebaseMessaging.send(message);
            logger.info("Notificación GLOBAL enviada con éxito. ID de Mensaje: {}", messageId);
            return messageId;
        } catch (Exception e) {
            logger.error("Error al enviar la notificación GLOBAL", e);
            throw new RuntimeException("Fallo en el envío de la notificación a Firebase.", e);
        }
    }

    /**
     * Envía una notificación a un dispositivo específico usando su Token FCM.
     *
     * @param request Datos de la notificación a enviar (debe incluir targetToken).
     * @return El ID del mensaje enviado por Firebase.
     */
    public String sendTokenNotification(NotificationRequest request) {
        // 1. Construir la notificación visible
        Notification notification = Notification.builder()
                .setTitle(request.getMessageTitle())
                .setBody(request.getMessageBody())
                .build();

        // 2. Construir el mensaje de FCM apuntando al token específico
        Message message = Message.builder()
                .setNotification(notification)
                .setToken(request.getTargetToken()) // Apunta al token del dispositivo
                .putData("source", "SIIA_ADMIN_WEB")
                .putData("dataType", "direct_message")
                .build();

        // 3. Enviar el mensaje
        try {
            String messageId = firebaseMessaging.send(message);
            logger.info("Notificación enviada con éxito al token {}. ID de Mensaje: {}", request.getTargetToken(), messageId);
            return messageId;
        } catch (Exception e) {
            logger.error("Error al enviar la notificación al token {}", request.getTargetToken(), e);
            throw new RuntimeException("Fallo en el envío de la notificación a Firebase.", e);
        }
    }

    /**
     * Envía una notificación a una lista de dispositivos específicos usando su Token FCM.
     * @param: request Datos de la notificación a enviar (debe incluir la lista de targetTokens).
     */
    public String sendMultiCastNotificacion(NotificationRequest request) {

        // 1. Construyes el mensaje multicast
        MulticastMessage message = MulticastMessage.builder()
                .setNotification(Notification.builder()
                        .setTitle(request.getMessageTitle())
                        .setBody(request.getMessageBody())
                        .build())
                .addAllTokens(request.getListTokens())
                .build();

        BatchResponse response;
        try {
            // 2. Envías el mensaje
            response = FirebaseMessaging.getInstance().sendEachForMulticast(message);

            // 3. Revisas si hubo fallos
            //(CLAVE PARA SABER QUE DISPOSITIVOS ESTAN ACTIVOS PERO APAGADOS Y QUE DISPOSITIVOS(tokens) YA NO EXISTEN
            if (response.getFailureCount() > 0) {
                List<SendResponse> responses = response.getResponses();
                List<String> tokensParaBorrar = new ArrayList<>();

                // 4. Iteras sobre las respuestas
                for (int i = 0; i < responses.size(); i++) {
                    if (!responses.get(i).isSuccessful()) {
                        // Si una falló, obtienes la excepción
                        FirebaseMessagingException e = responses.get(i).getException();
                        MessagingErrorCode error = e.getMessagingErrorCode();

                        // 5. ¡ESTA ES TU LÓGICA!
                        if (error == MessagingErrorCode.UNREGISTERED) {
                            // El token en esta posición falló por estar desregistrado
                            //Significa que la app ha sido desinstalada y por lo tanto el token ya no existe
                            String tokenFallido = request.getListTokens().get(i);
                            tokensParaBorrar.add(tokenFallido);

                            System.out.println("Token marcado para borrar: " + tokenFallido);
                        }
                    }
                }

                // 6. Ejecutas el borrado de los tokens en la BD (fuera del loop)
                if (!tokensParaBorrar.isEmpty()) {
                    // Aquí llamas a tu Repository o servicio de BD
                    // EJEMPLO:
                    // dispositivoActivoRepository.deleteAllByFcmTokenIn(tokensParaBorrar);
                    //System.out.println("Ejecutando: DELETE FROM DispositivosActivos WHERE fcm_token IN (" + tokensParaBorrar + ")");
                }
            }

            return response.getSuccessCount() + " mensajes enviados exitosamente.";

        } catch (FirebaseMessagingException e) {
            // Este CATCH solo se activa si la llamada a FCM falla por completo
            // (Ej: credenciales del Admin SDK inválidas, no hay red)
            System.err.println("Error fatal al enviar el multicast: " + e.getMessage());
            throw new RuntimeException("Fallo en el envío de la notificación multiple a Firebase.", e);
        }
    }
}
