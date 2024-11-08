import axios from "axios";
import { KMART_API_URL } from "../src/constants";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async (
    req: VercelRequest,
    res: VercelResponse,
): Promise<void> => {
    const { query } = req.query;
    const apiQuery = `
        query getPostcodeSuggestions($input: PostcodeQueryInput!) {
            postcodeQuery(input: $input) {
                postcode
                suburb
                state
                location {
                    lat
                    lon
                }
            }
        }
    `;

    const variables = {
        input: {
            country: "AU",
            query,
        },
    };

    try {
        const response = await axios.post(
            KMART_API_URL,
            {
                query: apiQuery,
                operationName: "getPostcodeSuggestions",
                variables,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        res.status(200).json({ data: response.data.data });
    } catch (error) {
        console.error("Error fetching data from GraphQL API:", error);
        res.status(500).json({ error: "Error fetching data from Kmart API" });
    }
};
