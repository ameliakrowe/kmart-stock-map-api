import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import cors from "cors";
import { getPostcodeSuggestions } from "./getPostcodeSuggestions";
import { AxiosError } from "axios";
import { getAllLocations } from "./getAllLocations";
import { getProductAvailability } from "./getProductAvailability";

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: ["http://localhost:3005", "https://kmart-stock-map.vercel.app"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    optionsSuccessStatus: 200,
  })
);

app.get(
  "/api/getProductAvailability",
  [
    query("productSKU")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Product SKU is required.")
      .isLength({ min: 8, max: 8 })
      .withMessage("Product SKU must be 8 characters.")
      .isInt()
      .withMessage("Product SKU must only contain digits."),
    query("lat")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Latitude is required.")
      .isNumeric()
      .withMessage("Latitude must be a number.")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude must be between -90 and 90."),
    query("lon")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Longitude is required.")
      .isNumeric()
      .withMessage("Longitude must be a number.")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude must be between -180 and 180."),
    query("searchRadius")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Search radius is required.")
      .isNumeric()
      .withMessage("Search radius must be a number.")
      .isFloat({ min: 1, max: 1000 })
      .withMessage("Search radius must be between 1 and 1000."),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const productSKU = req.query.productSKU as string;
    const lat = req.query.lat as string;
    const lon = req.query.lon as string;
    const searchRadius = Number(req.query.searchRadius as string);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const result = await getProductAvailability(
        productSKU,
        lat,
        lon,
        searchRadius
      );
      res.status(200).json(result);
    } catch (error) {
      const axiosError = error as AxiosError;
      res.status(500).json({
        message: axiosError.message,
      });
    }
  }
);

app.get("/api/getAllLocations", async (req: Request, res: Response) => {
  try {
    const result = await getAllLocations();
    res.status(200).json(result);
  } catch (error) {
    const axiosError = error as AxiosError;
    res.status(500).json({
      message: axiosError.message,
    });
  }
});

app.get("/api/getPostcodeSuggestions", async (req: Request, res: Response) => {
  const query = req.query.query as string;

  try {
    const result = await getPostcodeSuggestions(query);
    res.status(200).json(result);
  } catch (error) {
    const axiosError = error as AxiosError;
    res.status(500).json({
      message: axiosError.message,
    });
  }
});

module.exports = app;
app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
