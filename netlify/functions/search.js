
import https from "https";

export async function handler(event) {
    const GENIUS_API_URL = `https://api.genius.com/search?q=${encodeURIComponent(event.queryStringParameters.q)}`;
    const GENIUS_ACCESS_TOKEN = "UpinrTmjF6UUTmbxJoFrKKqxT_MNoTr-Fj5eK6-UYRp9-jFaVwHK3N1U-GOD_osn"; // Replace with actual token

    return new Promise((resolve, reject) => {
        const options = {
            headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
        };

        https.get(GENIUS_API_URL, options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const parsedData = JSON.parse(data);
                    const results = parsedData.response.hits.map(hit => ({
                        title: hit.result.full_title,
                        artist: hit.result.primary_artist.name,
                        url: hit.result.url
                    }));

                    resolve({
                        statusCode: 200,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ results }),
                    });
                } catch (error) {
                    reject({
                        statusCode: 500,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ error: "Error parsing response data" }),
                    });
                }
            });
        }).on("error", (error) => {
            reject({
                statusCode: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Error fetching data" }),
            });
        });
    });
}

// export async function handler(event) {
//     const GENIUS_API_URL = "https://api.genius.com/search";
//     const GENIUS_ACCESS_TOKEN = "UpinrTmjF6UUTmbxJoFrKKqxT_MNoTr-Fj5eK6-UYRp9-jFaVwHK3N1U-GOD_osn"; // Replace with actual token

//     try {
//         const query = event.queryStringParameters.q;
//         if (!query) {
//             return {
//                 statusCode: 400,
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ error: "Query parameter is required!" }),
//             };
//         }

//         // Fetch data using native `fetch()`
//         const response = await fetch(`${GENIUS_API_URL}?q=${query}`, {
//             headers: { Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}` }
//         });

//         const data = await response.json();

//         // Write API response to a log file (Netlify may not support, but try locally)
//         //fs.writeFileSync("../../genius-log.json", JSON.stringify(data, null, 2)); 

//         const results = data.response.hits.map(hit => ({
//             title: hit.result.full_title,
//             artist: hit.result.primary_artist.name,
//             url: hit.result.url
//         }));

//         //console.log(data)

//         return {
//             statusCode: 200,
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ results }),
//         };
//     } catch (error) {
//         console.error("Error fetching Genius API data:", error);
//         return {
//             statusCode: 500,
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ error: "Error fetching data" }),
//         };
//     }
// }

