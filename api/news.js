import axios from 'axios';

export default async function handler(req, res) {
    const keys = [process.env.NEWS_API_KEY, process.env.NEWS_API_KEY_2].filter(k => k);
    const baseUrl = 'https://newsdata.io/api/1/news';
    const { language, category, q, page } = req.query;

    const tryFetch = async (keyIndex) => {
        if (keyIndex >= keys.length) {
            // SI TODAS LAS CLAVES FALLARON, LANZA UN ERROR ESPECÍFICO
            throw new Error("ALL_KEYS_FAILED");
        }

        try {
            const response = await axios.get(baseUrl, {
                params: {
                    apikey: keys[keyIndex],
                    language: language || 'es',
                    category: category,
                    q: q,
                    page: (page && page !== 'null') ? page : undefined
                }
            });
            // Si la API devuelve un error en el JSON, también lo consideramos fallo
            if(response.data.status === 'error') throw new Error('API reported an error');
            return response.data;
        } catch (error) {
            console.warn(`API Key index ${keyIndex} failed.`);
            // Intentar con la siguiente clave
            return tryFetch(keyIndex + 1);
        }
    };

    try {
        const data = await tryFetch(0);
        res.status(200).json(data);
    } catch (error) {
        // SI SE CAPTURA "ALL_KEYS_FAILED", DEVOLVEMOS UN ERROR CONTROLADO, NO 500
        console.error("Todas las API keys fallaron.");
        res.status(429).json({ status: 'error', message: 'API rate limit exceeded on all keys.' });
    }
}