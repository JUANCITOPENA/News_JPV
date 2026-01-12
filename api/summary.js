export default async function handler(req, res) {
    // Modo mantenimiento simple: No contacta a Google/Gemini para evitar errores 500.
    res.status(200).json({ 
        summary: "<h3>⚠️ Función en Mantenimiento</h3><p>El resumen por Inteligencia Artificial es una característica exclusiva para suscriptores. <br><br>Por favor, utilice el botón <strong>'Leer noticia completa'</strong> para ver el artículo original.</p>" 
    });
}