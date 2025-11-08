package com.siiamovil.aplicacionfinal.fcm_siia.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.TopicManagementResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SuscripcionesService {

    /**
    * Método para suscribir usuarios(tokens) a los temas
    * */
    public void suscribirUsuarioATemas(String fcmToken, Long idUsuario) {
        // El token que recibiste de la app
        List<String> registrationTokens = List.of(fcmToken);

        try {
            // 1. Suscribir a "notificaciones_generales" (A ESTE SE SUSCRIBEN TODOS)
            String temaGeneral = "notificaciones_generales";
            TopicManagementResponse responseGeneral = FirebaseMessaging.getInstance()
                    .subscribeToTopic(registrationTokens, temaGeneral);

            //Obtener el conteo de tokens suscritos exitosamente
            System.out.println(responseGeneral.getSuccessCount() + " tokens fueron suscritos exitosamente a " + temaGeneral);

            // 2. Obtener la lista de grupos(temas) del usuario por medio de su idUsuario u otro dato
            List<String> temasUsuario = obtenerTemasUsuario(idUsuario);

            //3. Suscribir el token al tema(grupo) o temas(grupos) que pertenece el usuario
            for (String grupoTemaUsuario : temasUsuario) {
                if (grupoTemaUsuario != null) {
                    TopicManagementResponse responseEspecifico = FirebaseMessaging.getInstance()
                            .subscribeToTopic(registrationTokens, grupoTemaUsuario);
                    System.out.println(responseEspecifico.getSuccessCount() + " tokens fueron suscritos exitosamente a " + grupoTemaUsuario);
                    //System.out.println(responseEspecifico.getSuccessCount() te dice cuantos tokens fueron suscritos exitosamente
                }
            }

        } catch (FirebaseMessagingException e) {
            // Manejar el error, loggearlo, etc.
            System.err.println("Error al suscribir el token: " + e.getMessage());
        }
    }

    /**
     * Método para desuscribir un token de dispositivo de todos los temas del usuario cuando este CIERRA SU SESIÓN
     * */
    public void desuscribirTokenLogOut(String fcmToken, Long idUsuario) {

        // El token que recibiste de la app, lo metemos a una lista
        List<String> registrationTokens = List.of(fcmToken);

        try {
            // 1. Desuscribir de "notificaciones_generales"
            String temaGeneral = "notificaciones_generales";
            TopicManagementResponse responseGeneral = FirebaseMessaging.getInstance()
                    .unsubscribeFromTopic(registrationTokens, temaGeneral);
            System.out.println(responseGeneral.getSuccessCount() + " tokens fueron desuscritos de " + temaGeneral);

            //2. Desuscribir el token de los demas temas a los que estaba suscrito
            //Obtener la lista de grupos(temas) del usuario por medio de su idUsuario u otro dato
            List<String> temasUsuario = obtenerTemasUsuario(idUsuario);

            for (String grupoTemaUsuario : temasUsuario) {
                if (grupoTemaUsuario != null) {
                    TopicManagementResponse responseEspecifico = FirebaseMessaging.getInstance()
                            .unsubscribeFromTopic(registrationTokens, grupoTemaUsuario);
                    System.out.println(responseEspecifico.getSuccessCount() + " tokens fueron desuscritos de " + grupoTemaUsuario);
                }
            }

        } catch (FirebaseMessagingException e) {
            System.err.println("Error al desuscribir el token: " + e.getMessage());
        }
    }

    //Método para desuscribir los tokens de un usuario dado de baja o que ya no pertenece a la UATx
    public void desuscribirTokensBajaAbandono(Long idUsuario) {

        //Obtener todos los tokens activos del usuario
        List<String> registrationTokens = obtenerTokensUsuario(idUsuario);

        // Obtener todos los temas(grupos) a los que pertenecía el usuario
        List<String> temasUsuario = obtenerTemasUsuario(idUsuario);

        try {
            // 1. Desuscribir de "notificaciones_generales"
            String temaGeneral = "notificaciones_generales";
            TopicManagementResponse responseGeneral = FirebaseMessaging.getInstance()
                    .unsubscribeFromTopic(registrationTokens, temaGeneral);
            System.out.println(responseGeneral.getSuccessCount() + " tokens fueron desuscritos de " + temaGeneral);

            //2. Desuscribir cada token de los demas temas(grupos) a los que estaba suscrito el usuario
            for (String grupoTemaUsuario : temasUsuario) {
                if (grupoTemaUsuario != null) {
                    TopicManagementResponse responseEspecifico = FirebaseMessaging.getInstance()
                            .unsubscribeFromTopic(registrationTokens, grupoTemaUsuario);
                    System.out.println(responseEspecifico.getSuccessCount() + " tokens fueron desuscritos de " + grupoTemaUsuario);
                }
            }

        } catch (FirebaseMessagingException e) {
            //Registrar los tokens que no fueron desuscritos para eliminarlos posteriormente de la base (Opcional)
            System.err.println("Error al desuscribir el token: " + e.getMessage());
        }
    }

    // Ejemplo de mapeo hardcodeado: idUsuario -> lista de temas
    private List<String> obtenerTemasUsuario(Long idUsuario) {
        // En este punto se debe obtener la lista de grupos(temas) a los que pertenezca idUsuario
        //y retornar esa lista de strings
        List<String> temas = new ArrayList<>();

        // Ejemplos de mapeo estático
        switch (idUsuario != null ? idUsuario.intValue() : -1) {
            case 1:
                temas.add("notificaciones_generales");
                temas.add("ingenieria_computacion");
                temas.add("promociones");
                break;
            case 2:
                temas.add("notificaciones_generales");
                temas.add("egresados");
                break;
            case 3:
                temas.add("notificaciones_generales");
                break;
            default:
                break;
        }

        return temas;
    }
    // Ejemplo de mapeo hardcodeado: idUsuario -> lista de temas
    private List<String> obtenerTokensUsuario(Long idUsuario) {
        // En este punto se debe obtener la lista de tokens del usuario idUsuario y retornar esa lista de tokens
        List<String> tokens = new ArrayList<>();

        //Ir al repositorio y obtener todos los tokens activos del usuario, que serían los tokens de los dispositivos en
        //los que tiene su sesión iniciada

        //List<TokenModel> listaTokensActivos = usuarioRepository.getTokensActivos();
        //for(String token : listaTokensActivos){
            //tokens.add(token);
        //}
        tokens.add("fq40GuKFT4SPoEqtSSOt8s:APA91bEjwYPjGKq9n2lOQQvcOWLiKaSi-MrupJHpOY2arUthkr5CHHLTZWkN0HJLB0y_zbrFJd73Mu8Sb8RLnSl5VvTZGPuNhNW9J8HG4RujsZukaSCjI_E");
        tokens.add("gqi8hown87SBKJB:APA91bEjwYPjGKq9n2lOQQvcOWLiKaSi-MrupJHpOY2arUthkr5CHHLTZWkN0HJLB0y_zbrFJd73Mu8Sb8RLnSl5VvTZGPuNhNW9J8HG4RujsZskdfsed_r");

        return tokens;
    }
}
