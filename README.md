# 📰 JPV News: Portal de Noticias y Cine Inteligente

![Banner](https://capsule-render.vercel.app/api?type=waving&color=000000&height=250&section=header&text=JPV%20News&fontSize=90&animation=fadeIn&fontAlignY=38&desc=Manual%20de%20Ingeniería%20y%20Desarrollo&descAlignY=51&descAlign=50)

<div align="center">

![NodeJS](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Framework-black?style=for-the-badge&logo=express)
![Vercel](https://img.shields.io/badge/Vercel-Serverless-black?style=for-the-badge&logo=vercel)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)

</div>

---

## 📑 Tabla de Contenidos

1.  [🧐 Planteamiento del Proyecto](#-planteamiento-del-proyecto)
2.  [🛠️ Tecnologías y Conceptos](#-tecnologías-y-conceptos-clave)
3.  [🚀 Instalación Paso a Paso](#-instalación-paso-a-paso)
4.  [💡 Guía de Uso](#-guía-de-uso)
5.  [🧬 Anatomía del Código (Manual Técnico)](#-anatomía-del-código-explicación-técnica)
6.  [🔌 Guía de Extensibilidad](#-guía-de-extensibilidad)
7.  [☁️ Despliegue](#-despliegue)
8.  [🤝 Contribución](#-contribución)

---

## 🧐 Planteamiento del Proyecto

### El Problema
En el desarrollo web moderno, a menudo necesitamos consumir datos de APIs externas (como noticias, clima o películas). Un error común de principiante es hacer estas llamadas directamente desde el navegador (Frontend).
*   **Riesgo:** Al hacerlo, expones tus **API Keys** (claves privadas) en el código fuente. Cualquiera puede verlas, robarlas y usar tu cuota o generar costos a tu nombre.
*   **Desafío:** ¿Cómo mostramos datos en tiempo real de forma segura sin exponer nuestras credenciales?

### La Solución: JPV News
Hemos creado una arquitectura de **Proxy Inverso** o "Backend-for-Frontend":
1.  **Frontend Seguro:** El navegador solo habla con *nuestro* servidor interno.
2.  **Intermediario (Backend):** Nuestro servidor (Node.js) recibe la petición, le adjunta la credencial secreta y llama a la API externa.
3.  **Resultado:** El usuario ve las noticias, pero nunca tiene acceso a las claves que las obtuvieron.

---

## 🛠️ Tecnologías y Conceptos Clave

Para entender este proyecto, definamos las herramientas que usamos:

### 🟢 Node.js (El Motor)
*   **¿Qué es?**: Un entorno que nos permite ejecutar JavaScript fuera del navegador (en el servidor).
*   **¿Por qué lo usamos?**: Para construir nuestro Backend seguro y manejar las claves secretas lejos de los ojos del usuario.

### 🚂 Express.js (El Enrutador)
*   **¿Qué es?**: Un framework minimalista para Node.js.
*   **Función**: Organiza las "rutas" de nuestra aplicación. Si el usuario pide `/api/news`, Express sabe qué función ejecutar.

### 📡 Axios (El Mensajero)
*   **¿Qué es?**: Una librería para hacer peticiones HTTP (como `fetch` pero más potente).
*   **Uso**: Es el encargado de viajar desde nuestro servidor hasta *NewsData.io* o *TMDB* para traer la información.

### ▲ Vercel (La Nube)
*   **Concepto**: Plataforma de "Serverless Functions".
*   **Ventaja**: No necesitamos configurar un servidor Linux complejo. Vercel toma nuestros archivos en la carpeta `api/` y los convierte automáticamente en endpoints funcionales en internet.

### 🐳 Docker (El Contenedor)
*   **¿Qué es?**: Una herramienta que empaqueta nuestra aplicación con todo lo que necesita para funcionar.
*   **Beneficio**: "Si funciona en mi máquina, funciona en la tuya". Elimina los problemas de versiones y compatibilidad.

---

## 🚀 Instalación Paso a Paso

Sigue esta guía para tener el proyecto corriendo en tu máquina local en minutos.

### 1. Pre-requisitos
*   [Node.js (v18+)](https://nodejs.org/) instalado.
*   [Git](https://git-scm.com/) instalado.

### 2. Clonar el Repositorio
Abre tu terminal y ejecuta:

```bash
# Descarga el código fuente
git clone https://github.com/JUANCITOPENA/News_JPV.git

# Entra al directorio del proyecto
cd News_JPV
```

### 3. Instalar Dependencias
Instala las librerías definidas en `package.json`:

```bash
npm install
```

### 4. Configuración Segura (`.env`)
Las claves no se suben a GitHub. Crea un archivo `.env` en la raíz y configura tus secretos:

```env
PORT=3000
# Obtén tu key en newsdata.io
NEWS_API_KEY=tu_clave_secreta_aqui
# Obtén tu key en themoviedb.org
TMDB_API_KEY=tu_clave_secreta_aqui
```

### 5. Iniciar Servidor
```bash
npm start
```
Verás: `✅ Servidor de desarrollo listo en http://localhost:3000`

---

## 💡 Guía de Uso

1.  **Noticias**: Navega por las pestañas "Tecnología", "Deportes", etc. El sistema cargará las últimas novedades.
2.  **Cine**: Haz clic en la sección de Cine para ver películas en cartelera.
3.  **Búsqueda**: Usa la barra superior para buscar temas específicos (ej: "Bitcoin", "Marvel").

---

## 🧬 Anatomía del Código (Explicación Técnica)

Aquí desglosamos cómo está construido el sistema archivo por archivo.

### `package.json` (El DNI del proyecto)
Define los comandos y dependencias.
*   `"type": "module"`: Nos permite usar la sintaxis moderna `import/export`.
*   `"start": "node dev-server.js"`: Indica qué archivo arranca el servidor.

### `api/news.js` (Serverless Function)
Este archivo es el corazón de la seguridad.

```javascript
import axios from 'axios';

export default async function handler(req, res) {
    // Recibe la petición del Frontend
    const { category } = req.query;

    // Realiza la petición segura a la API externa
    // process.env.NEWS_API_KEY es invisible para el usuario
    const response = await axios.get('https://newsdata.io/api/1/news', {
        params: { apikey: process.env.NEWS_API_KEY, category }
    });

    // Devuelve solo los datos, sin exponer la key
    res.json(response.data);
}
```

### `dev-server.js` (Simulador Local)
Vercel ejecuta `api/` automáticamente en la nube, pero en tu PC necesitamos este archivo para simularlo. Usa Express para crear un servidor web local que "escucha" en el puerto 3000.

### `script.js` (Lógica Frontend)
Maneja la interacción con el usuario.
*   **`fetchNews()`**: No llama a `newsdata.io`. Llama a `/api/news`.
*   **Gestión del DOM**: Recibe el JSON y crea las tarjetas HTML dinámicamente.

---

## 🔌 Guía de Extensibilidad

**Reto:** ¿Quieres agregar una sección de **Criptomonedas**?

1.  **Backend (`api/crypto.js`)**:
    Crea un nuevo archivo en `api/` que consulte a una API como CoinGecko.
    ```javascript
    export default async function handler(req, res) {
        const data = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        res.json(data.data);
    }
    ```

2.  **Registro (`dev-server.js`)**:
    Importa y usa la nueva ruta.
    ```javascript
    import cryptoHandler from './api/crypto.js';
    app.get('/api/crypto', cryptoHandler);
    ```

3.  **Frontend (`script.js`)**:
    Haz un `fetch('/api/crypto')` y muestra el precio.

---

## ☁️ Despliegue

### Docker
Para entornos aislados o servidores Linux tradicionales.
```bash
docker build -t jpv-news .
docker run -p 3000:3000 --env-file .env jpv-news
```

### Vercel (Recomendado)
1.  Sube tu código a GitHub.
2.  Importa el proyecto en Vercel.
3.  **Importante**: Agrega tus Variables de Entorno en el panel de Vercel.
4.  ¡Listo! Vercel detecta la carpeta `api` y despliega automáticamente.

---

## 🤝 Contribución

¡Queremos tu ayuda!
1.  **Fork** este repo.
2.  Crea una rama (`git checkout -b feature/nueva-idea`).
3.  Commit y Push.
4.  Abre un **Pull Request**.

---

<div align="center">
  <sub>Documentación generada con fines educativos para JPV News.</sub>
</div>