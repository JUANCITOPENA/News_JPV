import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { text, lang } = req.body;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ summary: "⚠️ Modo Demo (Sin API Key de Google)." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const prompt = `Resume el siguiente texto en 3 puntos clave. Responde en: ${lang}. Texto: "${text.substring(0, 3000)}"`;

    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }]
        });
        const summary = response.data.candidates[0].content.parts[0].text;
        res.status(200).json({ summary });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar el resumen con Gemini.' });
    }
}