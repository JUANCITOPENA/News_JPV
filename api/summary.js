export default async function handler(req, res) {
    // API Desactivada por solicitud del usuario.
    res.status(200).json({ message: "AI Feature Disabled" });
}