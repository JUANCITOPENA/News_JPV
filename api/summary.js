import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const { text, title, lang } = req.body;
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ summary: "<p>⚠️ <strong>Modo Demo:</strong> Configure su API Key para activar la redacción inteligente.</p>" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    
    const prompt = `
    Actúa como un Redactor Jefe de noticias de alto nivel. 
    Tu objetivo es transformar el siguiente contenido en una crónica periodística de aproximadamente 150-200 palabras que sea fluida, coherente y visualmente atractiva.

    NOTICIA:
    Título: "${title}"
    Contenido: "${text ? text.substring(0, 2000) : 'Usar solo el título para expandir'}"

    REGLAS DE FORMATO (ESTRICTO):
    1. ESTRUCTURA: Divide el texto en 2 o 3 párrafos claros. No uses listas de puntos, usa prosa fluida.
    2. EMOJIS: Incluye emojis pertinentes al inicio de cada párrafo o sección para mejorar el UX.
    3. RESALTADO: Usa la etiqueta <span style="color: #0dcaf0; font-weight: bold;">Palabra</span> para resaltar entidades, nombres, fechas o datos clave (al menos 5 resaltados).
    4. TONO: Profesional, analítico y cautivador.
    5. HTML: Devuelve solo el contenido dentro de etiquetas <p> y <span>. No uses Markdown ni bloques de código.
    6. IDIOMA: ${lang}.
    `;

    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }]
        });
        let summary = response.data.candidates[0].content.parts[0].text;
        
        summary = summary.replace(/```html/g, '').replace(/```/g, '').trim();

        res.status(200).json({ summary });
    } catch (error) {
        console.error('Error Gemini:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al generar la redacción premium.' });
    }
}