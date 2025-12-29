// dev-server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar los handlers de la carpeta API
import newsHandler from './api/news.js';
import cinemaHandler from './api/cinema.js';
import summaryHandler from './api/summary.js';

// Cargar variables de entorno del archivo .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Definir las rutas de la API
app.get('/api/news', newsHandler);
app.get('/api/cinema', cinemaHandler);
app.post('/api/summary', summaryHandler);

// Servir el index.html en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`✅ Servidor de desarrollo listo en http://localhost:${port}`);
});