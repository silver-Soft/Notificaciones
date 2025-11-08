package com.siiamovil.aplicacionfinal.fcm_siia.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Configuración de Firebase Admin SDK.
 * Inicializa la aplicación de Firebase usando
 * las credenciales de servicio.
 */
@Configuration
public class FCMConfig {

    // Nombre del archivo JSON de la cuenta de servicio, para entorno local
    //private final String FIREBASE_CONFIG_PATH = "siia-movil-26537bec83da.json";

    // Esta es la ruta DENTRO del contenedor de Cloud Run
    // donde vamos a montar el secreto.
    private static final String SERVICE_ACCOUNT_PATH = "/app/secrets/service-account.json";

    /**
     * Bean que inicializa y provee la instancia de FirebaseApp para toda la aplicación.
     */
    @Bean
    public FirebaseApp initializeFirebaseApp() {
        try {
            // Cargar el archivo de credenciales desde la carpeta resources local
            //InputStream serviceAccount = new ClassPathResource(FIREBASE_CONFIG_PATH).getInputStream();

            // Usa la ruta del secreto montado en secretos de cloud
            FileInputStream serviceAccount = new FileInputStream(SERVICE_ACCOUNT_PATH);

            // Construir las opciones de Firebase usando las credenciales
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setProjectId("siia-movil") // Asegúrate que este sea el ID de tu proyecto Firebase
                    .build();

            // Aseguramos que la aplicación se inicialice solo una vez
            if (FirebaseApp.getApps().isEmpty()) {
                return FirebaseApp.initializeApp(options);
            } else {
                return FirebaseApp.getInstance();
            }
        } catch (IOException e) {
            // Manejo de errores si el archivo de configuración no se encuentra
            //System.err.println("Error al inicializar Firebase Admin SDK. Asegúrate de que " + FIREBASE_CONFIG_PATH + " esté en src/main/resources.");
            System.err.println("Error al inicializar Firebase Admin SDK. Asegúrate de que " + SERVICE_ACCOUNT_PATH + " esté habilitado en tus secretos.");
            throw new RuntimeException("Fallo crítico: No se pudo inicializar Firebase Admin SDK.", e);
        }
    }
}
