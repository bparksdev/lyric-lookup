import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static("public")); // Serve static files from the "public" folder

const GENIUS_API_URL = "https://api.genius.com/search";
const GENIUS_ACCESS_TOKEN = "UpinrTmjF6UUTmbxJoFrKKqxT_MNoTr-Fj5eK6-UYRp9-jFaVwHK3N1U-GOD_osn"; // Replace this with your actual Genius API token

// Route to search Genius API
app.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        const response = await axios.get(GENIUS_API_URL, {
            params: { q: query },
            headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
        });

        res.json(response.data); // Send response back to the frontend
        //console.log(response.data)
    } catch (error) {
        console.error("Error fetching Genius API data:", error);
        res.status(500).json({ error: "Error fetching data" });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
