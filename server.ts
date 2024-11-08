import express, { Request, Response } from "express";
import bodyParser from "body-parser";

import { getAllLocations } from "./src/getAllLocations";
import { getNearestLocations } from "./src/getNearestLocations";
//import { getPostcodeSuggestions } from "./src/getPostcodeSuggestions";
import { getProductAvailability } from "./src/getProductAvailability";
import { AxiosError } from "axios";

const app = express();

app.use(bodyParser.json());

/*app.get("/api/getPostcodeSuggestions", async (req: Request, res: Response) => {
    const query = req.query.query as string;

    try {
        const result = await getPostcodeSuggestions(query);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get postcode suggestions",
        });
    }
});*/

app.get("/api/getProductAvailability", async (req: Request, res: Response) => {
    const productSKU = req.query.productSKU as string;
    const postcode = req.query.postcode as string;
    const lat = req.query.lat as string;
    const lon = req.query.lon as string;
    const searchRadius = Number(req.query.searchRadius as string);

    try {
        const result = await getProductAvailability(
            productSKU,
            postcode,
            lat,
            lon,
            searchRadius,
        );
        res.status(200).json(result);
    } catch (error) {
        const axiosError = error as AxiosError;
        res.status(500).json({
            success: false,
            message: axiosError.message,
        });
    }
});

app.get("/api/getNearestLocations", async (req: Request, res: Response) => {
    const lat = req.query.lat as string;
    const lon = req.query.lon as string;
    const distance = req.query.distance as string;

    try {
        const result = await getNearestLocations(lat, lon, distance);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get nearest locations",
        });
    }
});

app.get("/api/getAllLocations", async (req: Request, res: Response) => {
    try {
        const result = await getAllLocations();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get all locations",
        });
    }
});

/*app.listen(5000, () => {
    console.log("server running");
});*/
