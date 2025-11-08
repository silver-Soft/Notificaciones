package com.siiamovil.aplicacionfinal.fcm_siia.controller;

import com.siiamovil.aplicacionfinal.fcm_siia.model.NotificationRequest;
import com.siiamovil.aplicacionfinal.fcm_siia.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador REST para manejar las solicitudes de envío de notificaciones.
 * Este endpoint será consumido por el módulo web de administración.
 */
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);
    private final NotificationService notificationService;

    // Inyección de dependencia a través del constructor (Mejor Práctica de Spring)
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Endpoint para enviar una notificación a un tema específico de FCM.
     *
     * @param request Datos del cuerpo de la solicitud, incluyendo título, cuerpo y tema.
     * @return Respuesta con el ID del mensaje enviado o un error.
     */
    @PostMapping("/send/topic")
    public ResponseEntity<Object> sendNotificationToTopic(@RequestBody NotificationRequest request) {
        // 1. Validaciones básicas de entrada
        if (request.getMessageTitle() == null || request.getMessageTitle().isBlank() ||
                request.getMessageBody() == null || request.getMessageBody().isBlank() ||
                request.getTargetTopic() == null || request.getTargetTopic().isBlank()) {

            logger.warn("Solicitud de notificación a TEMA rechazada: Campos vacíos. Título='{}', Cuerpo='{}', Tema='{}'",
                    request.getMessageTitle(), request.getMessageBody(), request.getTargetTopic());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("El título, cuerpo y tema no pueden estar vacíos."));
        }

        // 2. Llamada al servicio de envío
        try {
            String messageId = notificationService.sendTopicNotification(request);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new SuccessResponse(messageId, "Notificación enviada con éxito al tema: " + request.getTargetTopic()));

        } catch (RuntimeException e) {
            // Manejamos la excepción relanzada desde el NotificationService
            logger.error("Error al procesar la solicitud de envío a TEMA: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Fallo interno en el envío a Firebase. Detalle: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para enviar una notificación GLOBAL (a todos los usuarios suscritos al tema "all_users").
     *
     * @param request Datos del cuerpo de la solicitud (solo título y cuerpo).
     * @return Respuesta con el ID del mensaje enviado o un error.
     */
    @PostMapping("/send/global")
    public ResponseEntity<Object> sendNotificationGlobal(@RequestBody NotificationRequest request) {
        // 1. Validaciones básicas (solo título y cuerpo)
        if (request.getMessageTitle() == null || request.getMessageTitle().isBlank() ||
                request.getMessageBody() == null || request.getMessageBody().isBlank()) {

            logger.warn("Solicitud de notificación GLOBAL rechazada: Título o Cuerpo vacíos.");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("El título y el cuerpo no pueden estar vacíos."));
        }

        // 2. Llamada al servicio de envío
        try {
            String messageId = notificationService.sendGlobalNotification(request);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new SuccessResponse(messageId, "Notificación GLOBAL enviada con éxito."));

        } catch (RuntimeException e) {
            logger.error("Error al procesar la solicitud de envío GLOBAL: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Fallo interno en el envío a Firebase. Detalle: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para enviar una notificación a un dispositivo específico por su Token FCM.
     *
     * @param request Datos del cuerpo de la solicitud (título, cuerpo y token).
     * @return Respuesta con el ID del mensaje enviado o un error.
     */
    @PostMapping("/send/token")
    public ResponseEntity<Object> sendNotificationToToken(@RequestBody NotificationRequest request) {
        // 1. Validaciones (título, cuerpo y token)
        if (request.getMessageTitle() == null || request.getMessageTitle().isBlank() ||
                request.getMessageBody() == null || request.getMessageBody().isBlank() ||
                request.getTargetToken() == null || request.getTargetToken().isBlank()) {

            logger.warn("Solicitud de notificación a TOKEN rechazada: Campos vacíos.");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("El título, cuerpo y token no pueden estar vacíos."));
        }

        // 2. Llamada al servicio de envío
        try {
            String messageId = notificationService.sendTokenNotification(request);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new SuccessResponse(messageId, "Notificación enviada con éxito al token: " + request.getTargetToken()));

        } catch (RuntimeException e) {
            logger.error("Error al procesar la solicitud de envío a TOKEN: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Fallo interno en el envío a Firebase. Detalle: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para enviar una notificación a un dispositivo específico por su Token FCM.
     *
     * @param request Datos del cuerpo de la solicitud (título, cuerpo y token).
     * @return Respuesta con el ID del mensaje enviado o un error.
     */
    @PostMapping("/send/multiCastToken")
    public ResponseEntity<Object> sendMultiNotificationTokens(@RequestBody NotificationRequest request) {
        // 1. Validaciones (título, cuerpo y token)
        if (request.getMessageTitle() == null || request.getMessageTitle().isBlank() ||
                request.getMessageBody() == null || request.getMessageBody().isBlank() ||
                request.getListTokens().isEmpty()) {

            logger.warn("Solicitud de notificación a grupo de tokens rechazada: Campos vacíos.");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("El título, cuerpo y token no pueden estar vacíos."));
        }

        // 2. Llamada al servicio de envío
        try {
            String message = notificationService.sendMultiCastNotificacion(request);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(message);

        } catch (RuntimeException e) {
            logger.error("Error al procesar la solicitud de envío a TOKEN: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Fallo interno en el envío a Firebase. Detalle: " + e.getMessage()));
        }
    }

    // Clases internas para estandarizar la respuesta JSON de éxito/error

    private static class SuccessResponse {
        public final String messageId;
        public final String status;
        public SuccessResponse(String messageId, String status) {
            this.messageId = messageId;
            this.status = status;
        }
    }

    private static class ErrorResponse {
        public final String error;
        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}