# Guía de Ejecución del Proyecto

Este documento describe los pasos necesarios para ejecutar el backend en **Spring Boot** y el frontend en **Angular 15** en ambiente local.

---

## ✅ Requisitos Previos

### Backend (Spring Boot)

* Java 17 o superior (dependiendo de la versión indicada en el proyecto)
* Maven 3.8+ instalado y configurado en el `PATH`

### Frontend (Angular 15)

* Node.js **>= 14.20.0 y <= 18.x**
  (Se recomienda Node 16 LTS para evitar conflictos)
* npm (incluido al instalar Node.js)
* Angular CLI instalado globalmente

---

## 🚀 Ejecución del Backend (Spring Boot)

1. Abrir una terminal en la carpeta del proyecto backend.

2. Ejecutar el comando para descargar dependencias y compilar:

   ```bash
   mvn clean install
   ```

3. Para ejecutar la aplicación, utiliza:

   ```bash
   mvn spring-boot:run
   ```

4. Una vez iniciada, el backend estará disponible en:

   ```
   http://localhost:8080
   ```

---

## 💻 Ejecución del Frontend (Angular 15)

### 1. Instalar Node.js en la versión correcta

Descargar desde:
[https://nodejs.org/en/download](https://nodejs.org/en/download)

Verificar instalación:

```bash
node -v
npm -v
```

### 2. Instalar Angular CLI (si aún no está instalado)

```bash
npm install -g @angular/cli@15
```

### 3. Instalar dependencias del proyecto frontend

Ubicarse en la carpeta del proyecto Angular:

```bash
npm install
```

### 4. Ejecutar el proyecto

```bash
ng serve
```

Si necesitas exponerlo en otras redes (ej. probar desde el celular):

```bash
ng serve --host 0.0.0.0
```

La aplicación estará disponible en:

```
http://localhost:4200
```

---

## 🛠 Notas adicionales

* Si el backend requiere variables de entorno, configúralas antes de iniciar.
* Si ocurre un error de dependencias en Angular:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📬 Soporte

Si necesitas ayuda adicional, contacta al responsable del proyecto o revisa la documentación oficial:

* Spring Boot: [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)
* Angular: [https://angular.io/docs](https://angular.io/docs)

---
