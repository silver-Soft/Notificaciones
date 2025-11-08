# Guía de Ejecución del Proyecto

Este documento describe los pasos necesarios para ejecutar el backend en **Spring Boot** y el frontend en **Angular 15** en ambiente local.

---

## ✅ Requisitos Previos

### Backend (Spring Boot)
- Java 17 o superior (dependiendo de la versión indicada en el proyecto)
- Maven 3.8+ instalado y configurado en el `PATH`

### Frontend (Angular 15)
- Node.js **>= 14.20.0 y <= 18.x**  
  (Angular 15 requiere una versión no superior a Node 18)
- npm (se incluye al instalar Node.js)
- Angular CLI instalado globalmente

---

## 🚀 Ejecución del Backend (Spring Boot)

1. Abrir una terminal en la carpeta del proyecto backend.
2. Ejecutar el comando para descargar dependencias y compilar:

   ```bash
   mvn clean install
