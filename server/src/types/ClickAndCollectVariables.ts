import { ClickAndCollectSearchProduct } from "./ClickAndCollectSearchProduct";

export type ClickAndCollectVariables = {
    input: {
        country: string;
        postcode: string;
        products: ClickAndCollectSearchProduct[];
        fulfilmentMethods: string[];
    };
};
