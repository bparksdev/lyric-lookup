import axios from "axios";

export async function handler(event) {
    const GENIUS_API_URL = "https://api.genius.com/search";
    const GENIUS_ACCESS_TOKEN = "UpinrTmjF6UUTmbxJoFrKKqxT_MNoTr-Fj5eK6-UYRp9-jFaVwHK3N1U-GOD_osn"; // Replace with actual token

    try {
        const query = event.queryStringParameters.q;
        if (!query) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Query parameter is required" }),
            };
        }

        const response = await axios.get(GENIUS_API_URL, {
            params: { q: query },
            headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` },
        });

        const firstResult = response.data.response.hits[0]?.result;

        if (firstResult) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: firstResult.full_title,
                    artist: firstResult.primary_artist.name,
                    url: firstResult.url,
                }),
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "No results found" }),
            };
        }
    } catch (error) {
        console.error("Error fetching Genius API data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error fetching data" }),
        };
    }
}
