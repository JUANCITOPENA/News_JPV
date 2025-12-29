import axios from 'axios';

export default async function handler(req, res) {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'TMDB API Key not configured.' });
    
    const baseUrl = 'https://api.themoviedb.org/3';
    const { endpoint, language, page, query } = req.query;
    
    const langMap = { es: 'es-ES', en: 'en-US' };
    const tmdbLang = langMap[language] || 'es-ES';
    
    const url = endpoint === 'search' 
        ? `${baseUrl}/search/movie`
        : `${baseUrl}/movie/${endpoint}`;
        
    try {
        const response = await axios.get(url, {
            params: {
                api_key: apiKey,
                language: tmdbLang,
                page: page,
                query: query
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch movies from TMDB.' });
    }
}