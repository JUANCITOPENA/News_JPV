# 📰 JPV News: Manual de Desarrollo e Implementación

![Banner](https://capsule-render.vercel.app/api?type=waving&color=000000&height=250&section=header&text=JPV%20News&fontSize=90&animation=fadeIn&fontAlignY=38&desc=Manual%20Técnico%20Interactivo&descAlignY=51&descAlign=50)

<div align="center">

![NodeJS](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Server-black?style=for-the-badge&logo=express)
![Vercel](https://img.shields.io/badge/Vercel-Serverless-black?style=for-the-badge&logo=vercel)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)

</div>

---

## 📑 Tabla de Contenidos

1.  [Introducción y Arquitectura](#-introducción-y-arquitectura)
2.  [Instalación y Configuración](#-instalación-y-configuración)
3.  [Anatomía del Código (Paso a Paso)](#-anatomía-del-código-guía-de-construcción)
    *   [1. Configuración del Proyecto (`package.json`)](#1-configuración-del-proyecto-packagejson)
    *   [2. El Backend Serverless (`api/`)](#2-el-backend-serverless-api)
    *   [3. El Servidor de Desarrollo (`dev-server.js`)](#3-el-servidor-de-desarrollo-dev-serverjs)
    *   [4. El Frontend (`script.js`)](#4-el-frontend-scriptjs)
4.  [Guía de Extensibilidad (Añadir nuevas APIs)](#-guía-de-extensibilidad)
5.  [Despliegue](#-despliegue)

---

## 🏛 Introducción y Arquitectura

**El Problema:** Al crear aplicaciones web que consumen APIs de terceros (Noticias, Cine, Clima), insertar las claves secretas (`API_KEYS`) directamente en el código JavaScript del navegador es un grave error de seguridad. Cualquiera podría robarlas.

**La Solución (Arquitectura Proxy):**
Implementamos una arquitectura donde el **Frontend** nunca habla directamente con la API externa.
1.  El Frontend pide datos a *nuestro* Backend (`/api/news`).
2.  Nuestro Backend (seguro en el servidor) inyecta la clave secreta y pide los datos a `NewsData.io`.
3.  Nuestro Backend devuelve los datos limpios al Frontend.

---

## 🚀 Instalación y Configuración

### Prerrequisitos
*   **Node.js** (v18 o superior).
*   **Git** instalado.

### Paso 1: Clonar y Preparar
```bash
git clone https://github.com/JUANCITOPENA/News_JPV.git
cd News_JPV
npm install
```

### Paso 2: Variables de Entorno (`.env`)
Crea un archivo `.env` en la raíz. Este archivo simula las variables seguras de un servidor.

```env
PORT=3000
NEWS_API_KEY=tu_clave_de_newsdata_io
TMDB_API_KEY=tu_clave_de_tmdb
```

### Paso 3: Ejecución
```bash
# Modo Desarrollo (Usa dev-server.js)
npm start

# Modo Tests
npm test
```

---

## 🧬 Anatomía del Código (Guía de Construcción)

A continuación, explicamos cada componente vital del sistema. Puedes usar esto para reconstruir el proyecto o entender cómo modificarlo.

### 1. Configuración del Proyecto (`package.json`)
Este archivo define la identidad del proyecto y sus dependencias.

```json
{
  "type": "module",  // Permite usar 'import' en lugar de 'require'
  "scripts": {
    "start": "node dev-server.js", // Arranca nuestro servidor local
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  },
  "dependencies": {
    "axios": "^1.7.2",   // Cliente HTTP para hacer peticiones
    "dotenv": "^16.4.5", // Carga las variables del .env
    "express": "^4.19.2" // Servidor web ligero
  }
}
```

### 2. El Backend Serverless (`api/`)
En Vercel, cualquier archivo dentro de `api/` se convierte en una función en la nube.

#### Archivo: `api/news.js`
Este es el "Proxy". Recibe la petición del usuario, añade la llave secreta y consulta a la fuente real.

```javascript
import axios from 'axios';

export default async function handler(req, res) {
    // 1. Extraemos parámetros del frontend (categoría, búsqueda)
    const { category, q } = req.query;

    try {
        // 2. Hacemos la petición REAL a NewsData.io PROTEGIENDO la API Key
        // La key viene de process.env, el usuario nunca la ve.
        const response = await axios.get('https://newsdata.io/api/1/news', {
            params: {
                apikey: process.env.NEWS_API_KEY, // <--- AQUÍ ESTÁ EL SECRETO
                language: 'es',
                category: category,
                q: q
            }
        });

        // 3. Devolvemos los datos limpios al frontend
        res.status(200).json(response.data);

    } catch (error) {
        // Manejo de errores robusto
        res.status(500).json({ error: 'Error al obtener noticias' });
    }
}
```

### 3. El Servidor de Desarrollo (`dev-server.js`)
Como Vercel ejecuta las funciones `api/` automáticamente en la nube, necesitamos simular ese comportamiento en nuestra computadora local. Para eso sirve este archivo.

```javascript
import express from 'express';
import dotenv from 'dotenv';
import newsHandler from './api/news.js'; // Importamos la función

dotenv.config(); // Cargamos el .env

const app = express();

// Servimos los archivos estáticos (html, css, js)
app.use(express.static('.'));

// SIMULAMOS la ruta de Vercel
// Cuando alguien vaya a /api/news, ejecutamos nuestro handler
app.get('/api/news', newsHandler);

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
```

### 4. El Frontend (`script.js`)
La lógica que corre en el navegador del usuario.

```javascript
// Configuración: No llamamos a newsdata.io, llamamos a NUESTRO backend
const NEWS_ENDPOINT = '/api/news'; 

async function fetchNews(category) {
    try {
        // Petición a nuestro propio servidor
        const res = await fetch(`${NEWS_ENDPOINT}?category=${category}`);
        const data = await res.json();

        // Renderizado (simplificado)
        const container = document.getElementById('news-container');
        container.innerHTML = data.results.map(article => `
            <div class="card">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error cargando noticias:", error);
    }
}
```

---

## 🔌 Guía de Extensibilidad

¿Quieres agregar una nueva sección, por ejemplo, **Clima**? Sigue estos pasos:

### Paso 1: Crear la Ruta de API
Crea un archivo `api/weather.js`:

```javascript
// api/weather.js
import axios from 'axios';

export default async function handler(req, res) {
    const { city } = req.query;
    const apiKey = process.env.WEATHER_API_KEY; // Recuerda agregar esto al .env
    
    const data = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
    res.status(200).json(data.data);
}
```

### Paso 2: Registrar en `dev-server.js` (Solo para local)
Abre `dev-server.js` y añade:
```javascript
import weatherHandler from './api/weather.js';
app.get('/api/weather', weatherHandler);
```

### Paso 3: Consumir en Frontend (`script.js`)
```javascript
async function getWeather() {
    const res = await fetch('/api/weather?city=Madrid');
    const data = await res.json();
    console.log("Temperatura:", data.current.temp_c);
}
```

---

## ☁️ Despliegue

### Docker
El proyecto incluye un `Dockerfile` optimizado.
```bash
docker build -t jpv-news .
docker run -p 3000:3000 --env-file .env jpv-news
```

### Vercel (Producción)
1.  Sube tu código a GitHub.
2.  Impórtalo en Vercel.
3.  **Crucial:** En Vercel > Settings > Environment Variables, agrega `NEWS_API_KEY` y `TMDB_API_KEY`.
4.  Vercel detectará automáticamente la carpeta `api/` y no necesitas configurar nada más.

---

## 🤝 Contribución

1.  Hacer Fork del repositorio.
2.  Crear rama (`git checkout -b feature/AmazingFeature`).
3.  Commit (`git commit -m 'Add some AmazingFeature'`).
4.  Push (`git push origin feature/AmazingFeature`).
5.  Abrir Pull Request.

---

## 📜 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.
