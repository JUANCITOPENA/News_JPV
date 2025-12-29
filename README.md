# 📰 JPV News - Portal de Noticias y Cine

Bienvenido a **JPV News**, una aplicación web moderna que combina las últimas noticias globales con información actualizada sobre el mundo del cine. Este proyecto utiliza un frontend dinámico y una API construida con Node.js y Express.

## 🚀 Características

- **Noticias en Tiempo Real**: Integración con NewsData.io para noticias categorizadas (Tecnología, Negocios, Deportes, etc.).
- **Cartelera de Cine**: Datos actualizados de películas usando la API de TMDB.
- **Resúmenes con IA**: (Opcional) Funcionalidad preparada para generar resúmenes de noticias.
- **Modo Oscuro/Claro**: Interfaz adaptable a tus preferencias.
- **Responsive Design**: Funciona perfectamente en móviles y escritorio.

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **Infraestructura**: Docker, Vercel (Serverless Functions).
- **Herramientas**: Axios, Dotenv.

## 📋 Prerrequisitos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [NPM](https://www.npmjs.com/)
- Claves de API para:
  - [NewsData.io](https://newsdata.io/)
  - [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api)

## 🔧 Instalación y Configuración Local

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/TU_USUARIO/jpv-news.git
    cd jpv-news
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**
    Copia el archivo de ejemplo y crea tu propio `.env`:
    ```bash
    cp .env.example .env
    ```
    Edita el archivo `.env` y agrega tus API Keys.

4.  **Iniciar el servidor de desarrollo**
    ```bash
    npm start
    ```
    Visita `http://localhost:3000` en tu navegador.

## 🐳 Docker

Para ejecutar la aplicación en un contenedor aislado:

1.  **Construir la imagen**
    ```bash
    docker build -t jpv-news .
    ```

2.  **Correr el contenedor**
    ```bash
    docker run -p 3000:3000 --env-file .env jpv-news
    ```

## ☁️ Despliegue en Vercel

Este proyecto está optimizado para desplegarse fácilmente en [Vercel](https://vercel.com/).

1.  Instala Vercel CLI: `npm i -g vercel`
2.  Ejecuta `vercel` en la raíz del proyecto.
3.  **Importante**: En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega las mismas variables que tienes en tu `.env` (`NEWS_API_KEY`, `TMDB_API_KEY`, etc.).

## 🧪 Tests

Para ejecutar las pruebas unitarias (requiere configuración previa de Jest):

```bash
npm test
```

## 📂 Estructura del Proyecto

```
jpv-news/
├── api/                # Controladores de la API (Serverless functions)
├── img/                # Recursos estáticos
├── tests/              # Pruebas unitarias
├── .env.example        # Plantilla de variables de entorno
├── dev-server.js       # Servidor Express para desarrollo local
├── index.html          # Punto de entrada Frontend
├── script.js           # Lógica del Frontend
├── style.css           # Estilos
├── Dockerfile          # Configuración de Docker
└── package.json        # Dependencias y scripts
```

---
Desarrollado con ❤️ por [Tu Nombre]
