# 📰 JPV News: Tu Portal de Información Centralizado

![Banner](https://capsule-render.vercel.app/api?type=waving&color=000000&height=250&section=header&text=JPV%20News&fontSize=90&animation=fadeIn&fontAlignY=38&desc=Noticias%20Globales%20y%20Cine%20en%20Tiempo%20Real&descAlignY=51&descAlign=50)

<div align="center">

![NodeJS](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4.x-black?style=for-the-badge&logo=express)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/Licencia-MIT-yellow?style=for-the-badge)

</div>

---

## 🧐 Planteamiento del Problema

En la era digital actual, nos enfrentamos a una **saturación de información**.
*   ¿Quieres ver noticias de tecnología? Vas a un sitio web.
*   ¿Quieres ver qué películas están en cartelera? Vas a otro.
*   ¿Quieres un resumen rápido? Tienes que leer artículos interminables.

**El Desafío Técnico:** Además, como desarrolladores, sabemos que consumir APIs públicas directamente desde el navegador (Frontend) es inseguro porque expone nuestras **API Keys** privadas al mundo.

---

## 💡 La Solución: JPV News

**JPV News** es una aplicación web full-stack diseñada para resolver estos problemas. Actúa como un **Dashboard Unificado** que agrega:
1.  **Noticias en tiempo real** (vía NewsData.io).
2.  **Cartelera de cine actualizada** (vía TMDB).
3.  **Seguridad Backend**: Utiliza un servidor intermedio (Proxy) en Node.js para ocultar las credenciales.

> **Objetivo Didáctico:** Este proyecto sirve como plantilla perfecta para aprender a conectar un Frontend moderno con un Backend seguro y desplegarlo en la nube.

---

## 🛠️ Tecnologías

Este proyecto está construido con un stack moderno y robusto:

### Frontend (La cara del sitio)
*   **HTML5** 🌐: Estructura semántica.
*   **CSS3** 🎨: Diseño responsivo y animaciones (Modo Oscuro incluido).
*   **JavaScript (ES6+)** ⚡: Lógica del cliente y manipulación del DOM.

### Backend (El cerebro)
*   **Node.js** 🟢: Entorno de ejecución para el servidor.
*   **Express.js** 🚂: Framework para manejar las rutas de la API.
*   **Axios** 📡: Para realizar peticiones HTTP a servicios externos.

### Infraestructura y Herramientas
*   **Docker** 🐳: Para contenerizar la aplicación.
*   **Vercel** ▲: Para despliegue continuo y Serverless Functions.
*   **Git & GitHub** 🐙: Control de versiones.

---

## 🚀 Instalación: Guía Paso a Paso

Sigue estos pasos para tener el proyecto corriendo en tu máquina local en menos de 5 minutos.

### 1. Pre-requisitos
Asegúrate de tener instalado lo siguiente (haz clic para descargar):
*   [Node.js (v18+)](https://nodejs.org/) 🟢
*   [Git](https://git-scm.com/) 🐙
*   [VS Code](https://code.visualstudio.com/) 💻 (Recomendado)

### 2. Clonar el Repositorio
Abre tu terminal (PowerShell, CMD o Bash) y ejecuta:

```bash
# Descarga el código a tu computadora
git clone https://github.com/JUANCITOPENA/News_JPV.git

# Entra en la carpeta del proyecto
cd News_JPV
```

### 3. Instalar Dependencias
El proyecto necesita librerías externas (como `express` o `dotenv`). Instálalas con un solo comando:

```bash
npm install
```

### 4. Configuración de Seguridad (`.env`)
**IMPORTANTE:** Nunca subas tus claves reales a GitHub. Usamos variables de entorno.

1.  Crea un archivo llamado `.env` en la raíz del proyecto.
2.  Copia y pega el siguiente contenido, reemplazando los valores por tus propias claves:

```env
# Configuración del Puerto
PORT=3000

# API KEY: NewsData.io (Noticias)
# Consíguela gratis en: https://newsdata.io/
NEWS_API_KEY=tu_clave_secreta_aqui

# API KEY: TMDB (Cine)
# Consíguela gratis en: https://www.themoviedb.org/documentation/api
TMDB_API_KEY=tu_clave_secreta_aqui
```

### 5. ¡Arrancar la Aplicación! 🏁
Todo listo. Inicia el servidor de desarrollo:

```bash
npm start
```

Verás un mensaje como este:
> `✅ Servidor de desarrollo listo en http://localhost:3000`

Abre tu navegador favorito y ve a `http://localhost:3000`. ¡Disfruta!

---

## 🐋 Uso con Docker (Opcional)

Si prefieres usar contenedores para no "ensuciar" tu entorno local, hemos preparado un `Dockerfile`.

1.  **Construir la imagen:**
    ```bash
    docker build -t jpv-news .
    ```

2.  **Correr el contenedor:**
    ```bash
    docker run -p 3000:3000 --env-file .env jpv-news
    ```

---

## ☁️ Despliegue en Vercel

¿Quieres que el mundo vea tu proyecto? Sigue estos pasos para subirlo gratis a Vercel.

1.  Crea una cuenta en [Vercel.com](https://vercel.com).
2.  Instala la CLI de Vercel (opcional) o conecta tu cuenta de GitHub desde el dashboard web.
3.  Importa el repositorio `News_JPV`.
4.  **Configuración Vital:** En la sección "Environment Variables", añade las mismas claves que pusiste en tu archivo `.env` (`NEWS_API_KEY`, etc.).
5.  Haz clic en **Deploy**.

¡Vercel detectará automáticamente la carpeta `api/` y la convertirá en funciones Serverless!

---

## 🧪 Estructura del Código

Para que entiendas cómo modificarlo, aquí tienes el mapa del tesoro:

```
News_JPV/
├── api/                  # 🧠 LOGICA DEL SERVIDOR (Backend)
│   ├── news.js           # Proxy para noticias
│   └── cinema.js         # Proxy para películas
├── img/                  # 🖼️ Imágenes y recursos
├── tests/                # 🧪 Pruebas unitarias
├── index.html            # 🦴 Esqueleto del sitio
├── script.js             # ⚡ Cerebro del Frontend (Llama a /api/...)
├── style.css             # 🎨 Maquillaje (Estilos)
├── package.json          # 📦 Lista de ingredientes (Dependencias)
└── .env                  # 🔐 CAJA FUERTE (No subir a GitHub)
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si quieres mejorar este proyecto:

1.  Haz un **Fork** del proyecto (botón arriba a la derecha en GitHub).
2.  Crea una rama para tu feature (`git checkout -b feature/NuevaMejora`).
3.  Haz tus cambios y commitéalos (`git commit -m 'feat: Agregué modo lectura'`).
4.  Haz Push a tu rama (`git push origin feature/NuevaMejora`).
5.  Abre un **Pull Request**.

---

## 🆘 Soporte

Si encuentras un bug o tienes problemas con la instalación:

1.  Revisa que tus API Keys sean correctas y tengan saldo/crédito gratuito.
2.  Asegúrate de que el puerto 3000 no esté ocupado.
3.  Abre un [Issue en GitHub](https://github.com/JUANCITOPENA/News_JPV/issues) describiendo el error.

---

## 📜 Licencia

Este proyecto está bajo la Licencia **MIT**. Eres libre de usarlo, modificarlo y distribuirlo, siempre y cuando mantengas la atribución al autor original.

---

<div align="center">
  <sub>Desarrollado con ❤️ y mucho ☕ por Juan Peña</sub>
</div>