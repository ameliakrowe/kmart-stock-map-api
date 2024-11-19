import axios from "axios";
import { KMART_API_URL, POSTCODE_SUGGESTIONS_API_QUERY } from "./constants";

export async function getPostcodeSuggestions(queryString: string) {
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
        query: POSTCODE_SUGGESTIONS_API_QUERY,
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
