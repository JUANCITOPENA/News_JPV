# 📰 JPV News: Manual Maestro de Ingeniería y Desarrollo

![Banner](https://capsule-render.vercel.app/api?type=waving&color=000000&height=250&section=header&text=JPV%20News&fontSize=90&animation=fadeIn&fontAlignY=38&desc=Manual%20Interactivo%20Full%20Stack&descAlignY=51&descAlign=50)

<div align="center">

![NodeJS](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Framework-black?style=for-the-badge&logo=express)
![Vercel](https://img.shields.io/badge/Vercel-Serverless-black?style=for-the-badge&logo=vercel)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![License](https://img.shields.io/badge/Licencia-MIT-yellow?style=for-the-badge)

</div>

---

Este documento es un manual completo. Te guiará desde la creación de cuentas para obtener API Keys, pasando por la instalación del entorno, hasta la explicación línea por línea del código fuente.

## 📑 Tabla de Contenidos

1.  [🧐 Contexto y Arquitectura](#-contexto-y-arquitectura)
2.  [🔑 Fase 1: Obtención de Credenciales (API Keys)](#-fase-1-obtención-de-credenciales-api-keys)
3.  [💻 Fase 2: Configuración del Entorno Local](#-fase-2-configuración-del-entorno-local)
4.  [⚙️ Fase 3: Instalación y Configuración](#-fase-3-instalación-y-configuración)
5.  [📘 Fase 4: Manual de Código (Estructura y Desarrollo)](#-fase-4-manual-de-código-estructura-y-desarrollo)
    *   [Estructura del Proyecto](#estructura-del-proyecto)
    *   [Backend y API Proxy](#backend-y-api-proxy)
    *   [Frontend y Lógica](#frontend-y-lógica)
6.  [🧪 Fase 5: Testing y Calidad](#-fase-5-testing-y-calidad)
7.  [☁️ Fase 6: Despliegue (Docker y Vercel)](#-fase-6-despliegue-docker-y-vercel)
8.  [🔌 Guía de Extensibilidad](#-guía-de-extensibilidad)

---

## 🧐 Contexto y Arquitectura

### El Problema
Desarrollar aplicaciones web modernas requiere conectar con el mundo exterior (APIs). Sin embargo, conectar un Frontend (HTML/JS) directamente a una API pagada o privada expone tus **Credenciales (API Keys)**. Cualquier usuario puede dar "Click derecho -> Inspeccionar" y robar tu llave.

### La Solución: Arquitectura Proxy Serverless
Utilizamos un diseño de **Backend-for-Frontend (BFF)**.
1.  **Cliente (Navegador):** Solo conoce nuestro servidor (`/api/news`).
2.  **Servidor (Node.js/Vercel):** Guarda el secreto en variables de entorno, recibe la petición del cliente, le pega su etiqueta de seguridad y llama a la API real.
3.  **Seguridad:** El secreto nunca sale del servidor.

---

## 🔑 Fase 1: Obtención de Credenciales (API Keys)

Antes de tocar una línea de código, necesitas "las llaves del reino".

### 1. NewsData.io (Noticias)
Esta API nos provee las noticias globales.
1.  Ve a [NewsData.io](https://newsdata.io/).
2.  Haz clic en **"Sign Up"** y crea una cuenta gratuita.
3.  Ve al **Dashboard**.
4.  Copia la cadena de texto que dice **"API KEY"**.
5.  *Guárdala, la usaremos pronto.*

### 2. TMDB (Cine)
Esta API nos da la cartelera de películas e imágenes.
1.  Ve a [TheMovieDB.org](https://www.themoviedb.org/).
2.  Regístrate y verifica tu email.
3.  Ve a **Configuración** -> **API** (en la barra lateral izquierda).
4.  Haz clic en **"Solicitar"** (Request) -> **"Developer"**.
5.  Llena el formulario (puedes poner que es para un proyecto personal educativo).
6.  Copia la **"API Key (v3 auth)"**.

---

## 💻 Fase 2: Configuración del Entorno Local

Prepara tu computadora como un ingeniero de software profesional.

1.  **Descargar Node.js**: Es el motor que moverá nuestro código.
    *   [Descargar aquí (Versión LTS recomendada)](https://nodejs.org/).
    *   Instala con "Siguiente, Siguiente, Siguiente".
2.  **Descargar Git**: Para gestionar el código.
    *   [Descargar Git SCM](https://git-scm.com/).
3.  **Editor de Código**:
    *   Recomendamos [Visual Studio Code](https://code.visualstudio.com/).

---

## ⚙️ Fase 3: Instalación y Configuración

Sigue estos comandos paso a paso en tu terminal.

### 1. Clonar el Proyecto
Trae el código desde GitHub a tu carpeta local.
```bash
git clone https://github.com/JUANCITOPENA/News_JPV.git
cd News_JPV
```

### 2. Instalar Dependencias
Leemos el `package.json` e instalamos las librerías necesarias.
```bash
npm install
```
*Esto creará la carpeta `node_modules`. Nunca la toques manualmente.*

### 3. Gestión de Credenciales (`.env`)
Configuramos la seguridad.
1.  Copia el archivo de ejemplo:
    ```bash
    # En Windows (Powershell)
    copy .env.example .env
    # En Mac/Linux
    cp .env.example .env
    ```
2.  Abre el archivo `.env` con tu editor y pega las API Keys que obtuviste en la Fase 1.

```env
PORT=3000
NEWS_API_KEY=pegale_aqui_tu_clave_de_newsdata
TMDB_API_KEY=pegale_aqui_tu_clave_de_tmdb
```

### 4. Iniciar Aplicación
```bash
npm start
```
Abre tu navegador en `http://localhost:3000`.

---

## 📘 Fase 4: Manual de Código (Estructura y Desarrollo)

Aquí desglosamos la ingeniería del proyecto. Entender esto te permitirá modificarlo a tu gusto.

### Estructura del Proyecto

```
JPV-NEWS/
├── .env                  # 🔐 SECRETOS (No subir a GitHub)
├── dev-server.js         # 🛠️ Servidor Local (Simulador Vercel)
├── package.json          # 📦 Configuración y Dependencias
├── api/                  # ☁️ SERVERLESS FUNCTIONS (Backend)
│   ├── news.js           # Proxy Noticias
│   ├── cinema.js         # Proxy Cine
│   └── summary.js        # Proxy IA
├── img/                  # 🎨 Recursos visuales
├── tests/                # 🧪 Pruebas Unitarias
├── script.js             # ⚡ Lógica Frontend (Cliente)
├── style.css             # 🎨 Estilos Visuales
└── index.html            # 🦴 Estructura HTML
```

### Backend y API Proxy

#### `api/news.js` (Código Explicado)
Este archivo intercepta la petición del usuario para proteger la API Key.

```javascript
import axios from 'axios';

// La función principal que Vercel ejecuta cuando alguien llama a /api/news
export default async function handler(req, res) {
    // 1. Obtenemos los filtros que envió el frontend
    const { category, q, page } = req.query;

    // 2. Definimos las claves (podemos tener varias para evitar límites)
    const keys = [process.env.NEWS_API_KEY, process.env.NEWS_API_KEY_2].filter(k => k);

    try {
        // 3. Hacemos la llamada a la API externa (NewsData.io)
        // NOTA: Aquí es donde inyectamos la 'apikey' segura.
        const response = await axios.get('https://newsdata.io/api/1/news', {
            params: {
                apikey: keys[0], // Usamos la primera llave disponible
                language: 'es',
                category: category,
                q: q
            }
        });

        // 4. Respondemos al Frontend con los datos limpios
        res.status(200).json(response.data);

    } catch (error) {
        // 5. Manejo de errores
        console.error("Error en API News:", error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
```

#### `dev-server.js` (El Simulador)
Vercel corre las funciones `api/` automáticamente en la nube. En local, necesitamos simular eso.

```javascript
import express from 'express';
import dotenv from 'dotenv';
import newsHandler from './api/news.js'; // Importamos el handler real

dotenv.config(); // Cargar variables de entorno

const app = express();
const port = 3000;

app.use(express.static('.')); // Servir archivos frontend (html, css)

// RUTA MÁGICA: Conectamos la URL /api/news con nuestra función
app.get('/api/news', newsHandler);

app.listen(port, () => {
    console.log(`✅ Servidor listo en http://localhost:${port}`);
});
```

### Frontend y Lógica

#### `script.js` (Fragmento Clave)
Cómo el navegador pide datos sin saber la API Key.

```javascript
// Configuración: Apuntamos a NUESTRO backend, no a la API externa
const NEWS_ENDPOINT = '/api/news';

async function loadNews() {
    try {
        // Hacemos fetch a nuestro servidor local o Vercel
        const response = await fetch(`${NEWS_ENDPOINT}?category=technology`);
        const data = await response.json();

        // Renderizamos los datos en el HTML
        renderArticles(data.results);
    } catch (error) {
        showError("No se pudieron cargar las noticias");
    }
}
```

---

## 🧪 Fase 5: Testing y Calidad

Un buen ingeniero prueba su código. Hemos incluido **Jest** para pruebas unitarias.

### Ejecutar Pruebas
```bash
npm test
```

### ¿Qué estamos probando? (`tests/basic.test.js`)
Validamos que el entorno no esté "roto".
1.  Verificamos que `NODE_ENV` exista (importante para despliegue).
2.  Verificamos que el `package.json` tenga los scripts correctos.

---

## ☁️ Fase 6: Despliegue (Docker y Vercel)

Llevando tu proyecto al mundo real.

### Opción A: Vercel (Recomendada)
La forma más rápida y moderna.
1.  Sube tu código a GitHub.
2.  Ve a [Vercel.com](https://vercel.com) -> "Add New Project".
3.  Importa `News_JPV`.
4.  **Paso Crítico:** En "Environment Variables", agrega:
    *   Key: `NEWS_API_KEY`, Value: `tu_clave_real`
    *   Key: `TMDB_API_KEY`, Value: `tu_clave_real`
5.  **Deploy**. Vercel detectará la carpeta `api/` automáticamente.

### Opción B: Docker
Para correr en cualquier servidor Linux/AWS/Azure.

1.  **Construir imagen:**
    ```bash
    docker build -t jpv-news .
    ```
2.  **Correr contenedor:**
    ```bash
    docker run -p 3000:3000 --env-file .env jpv-news
    ```

---

## 🔌 Guía de Extensibilidad

**Caso de Uso:** Agregar cotización del **Dólar**.

1.  **Crear Handler Backend (`api/dolar.js`):**
    ```javascript
    import axios from 'axios';
    export default async function handler(req, res) {
        const data = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        res.json(data.data);
    }
    ```
2.  **Registrar en Local (`dev-server.js`):**
    ```javascript
    import dolarHandler from './api/dolar.js';
    app.get('/api/dolar', dolarHandler);
    ```
3.  **Consumir en Frontend:**
    `fetch('/api/dolar').then(...)`

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**. Eres libre de usarlo para aprender, copiar o vender, siempre y cuando des crédito.

<div align="center">
  <sub>Documentación generada automáticamente por Gemini Assistant para JPV News.</sub>
</div>
