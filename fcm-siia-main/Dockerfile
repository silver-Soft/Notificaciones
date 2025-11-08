# --- Etapa 1: Compilación (Build) ---
# Usamos una imagen de Maven con OpenJDK 17 para compilar el proyecto
FROM maven:3.9-eclipse-temurin-17 AS build

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo el pom.xml primero para aprovechar la caché de capas de Docker
COPY pom.xml .

# Descargamos las dependencias (esto solo se re-ejecuta si el pom.xml cambia)
RUN mvn dependency:go-offline

# Copiamos el resto del código fuente
COPY src ./src

# Compilamos la aplicación y generamos el archivo .jar
# El "skipTests" es para acelerar la compilación en el despliegue
RUN mvn package -DskipTests

# --- Etapa 2: Ejecución (Run) ---
# Usamos una imagen JRE mínima y segura para ejecutar la app (más ligera que JDK)
FROM eclipse-temurin:17-jre-jammy

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos el .jar compilado desde la etapa 'build' a esta nueva imagen
# DEBES asegurarte que el nombre del .jar coincida con el de tu pom.xml (artifactId-version)
COPY --from=build /app/target/fcm-siia-0.0.1-SNAPSHOT.jar app.jar

# Cloud Run espera que las aplicaciones escuchen en el puerto 8080 por defecto
ENV PORT 8080
EXPOSE 8080

# Comando para ejecutar la aplicación cuando el contenedor inicie
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
