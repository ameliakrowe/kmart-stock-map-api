import axios from "axios";
import { KMART_API_URL } from "./constants";

export async function getPostcodeSuggestions(queryString: string) {
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
      query: queryString,
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
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data from GraphQL API:", error);
    throw new Error(
      "Something went wrong getting suggestions. Please try again."
    );
  }
}
