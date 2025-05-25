export async function handler(event) {
    const GENIUS_API_URL = "https://api.genius.com/search";
    const GENIUS_ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"; // Replace with actual token

    try {
        const query = event.queryStringParameters.q;
        if (!query) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Query parameter is required" }),
            };
        }

        // Use fetch instead of Axios
        const response = await fetch(`${GENIUS_API_URL}?q=${query}`, {
            headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
        });

        const data = await response.json();
        const firstResult = data.response.hits[0]?.result;

        if (firstResult) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: firstResult.full_title,
                    artist: firstResult.primary_artist.name,
                    url: firstResult.url
                }),
            };
        } else {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "No results found" }),
            };
        }
    } catch (error) {
        console.error("Error fetching Genius API data:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Error fetching data" }),
        };
    }
}
