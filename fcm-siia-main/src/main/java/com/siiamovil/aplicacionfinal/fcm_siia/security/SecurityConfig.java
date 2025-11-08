package com.siiamovil.aplicacionfinal.fcm_siia.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuración de Spring Security para deshabilitar temporalmente la autenticación
 * en el endpoint de notificaciones, permitiendo pruebas con Postman y la integración inicial.
 *
 * NOTA: Esta configuración es TEMPORAL y DEBE ser reemplazada por un filtro de JWT
 * que valide los tokens del backend de producción.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. (LA CORRECCIÓN) Habilita CORS usando el bean "corsConfigurationSource"
                .cors(Customizer.withDefaults())

                // 2. Deshabilita CSRF (común para APIs REST)
                .csrf(AbstractHttpConfigurer::disable)

                // 3. Define las reglas de autorización
                .authorizeHttpRequests(auth -> auth
                        // Permite todas las solicitudes (incluyendo OPTIONS) a tus endpoints
                        .requestMatchers("/api/v1/notifications/**").permitAll()
                        // (Opcional) Asegura cualquier otro endpoint si existiera
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:4200", //DESARROLLO LOCAL
                "https://siia-fcm-service-495517142799.us-central1.run.app" //URL DEL CONTENEDOR EN CLOUD RUN
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /*
    *### ¡Importante! (Redesplegar) cada que se realice un cambio

    Comandos:

    1.  **Construir y Subir (con el cambio):**
        ```bash
        gcloud builds submit . --tag=us-central1-docker.pkg.dev/fmcservices-siia/siia-repositorio/siia-fcm-service --project=fmcservices-siia
        ```

    2.  **Desplegar la nueva imagen (actualizará el servicio):**
        ```bash
        gcloud run deploy siia-fcm-service --image=us-central1-docker.pkg.dev/fmcservices-siia/siia-repositorio/siia-fcm-service --platform managed --region us-central1 --allow-unauthenticated
        *
    3.  **Desplegar la nueva imagen indicando rutas del secreto en cloud
        ```bash
        gcloud run deploy siia-fcm-service --image=us-central1-docker.pkg.dev/fmcservices-siia/siia-repositorio/siia-fcm-service --platform managed --region us-central1 --allow-unauthenticated --update-secrets=/app/secrets/service-account.json=firebase-service-account-json-prod:latest

--project=fmcservices-siia
    *
    * */

}
