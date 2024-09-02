// Import packages
const express = require("express");
const SerpApi = require("google-search-results-nodejs");

// Middlewares
const app = express();
app.use(express.json());

// Configuración de SerpApi
const serpApiKey = process.env.SERPAPI_KEY; 
const client = new SerpApi.GoogleSearch(serpApiKey);

// Endpoint /buscar
app.get("/buscar", (req, res) => {
  const consulta = req.query.q;
  if (!consulta || consulta.trim() === "") {
    return res.status(400).json({ error: "Falta el parámetro 'q' en la búsqueda" });
  }

  const params = {
    q: consulta,
    engine: "google",
    tbm: "isch", 
    hl: "es",
    gl: "es",
  };

  client.json(params, (data) => {
    try {
      if (!data || !data.images_results || data.images_results.length === 0) {
        return res.status(404).json({ error: "No se encontraron imágenes" });
      }

      const resultados = data.images_results.slice(0, 12).map((img) => img.original || img.link);

      res.json(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al procesar la búsqueda" });
    }
  });
});

// Connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening on port ${port}`));
