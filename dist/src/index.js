"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const cors_1 = __importDefault(require("cors"));
const getPostcodeSuggestions_1 = require("./getPostcodeSuggestions");
const getAllLocations_1 = require("./getAllLocations");
const getProductAvailability_1 = require("./getProductAvailability");
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)({
    origin: ["http://localhost:3005", "https://kmart-stock-map.vercel.app"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    optionsSuccessStatus: 200,
}));
app.get("/api/getProductAvailability", [
    (0, express_validator_1.query)("productSKU")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Product SKU is required.")
        .isLength({ min: 8, max: 8 })
        .withMessage("Product SKU must be 8 characters.")
        .isInt()
        .withMessage("Product SKU must only contain digits."),
    (0, express_validator_1.query)("lat")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Latitude is required.")
        .isNumeric()
        .withMessage("Latitude must be a number.")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be between -90 and 90."),
    (0, express_validator_1.query)("lon")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Longitude is required.")
        .isNumeric()
        .withMessage("Longitude must be a number.")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be between -180 and 180."),
    (0, express_validator_1.query)("searchRadius")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Search radius is required.")
        .isNumeric()
        .withMessage("Search radius must be a number.")
        .isFloat({ min: 1, max: 1000 })
        .withMessage("Search radius must be between 1 and 1000."),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productSKU = req.query.productSKU;
    const lat = req.query.lat;
    const lon = req.query.lon;
    const searchRadius = Number(req.query.searchRadius);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const result = yield (0, getProductAvailability_1.getProductAvailability)(productSKU, lat, lon, searchRadius);
        res.status(200).json(result);
    }
    catch (error) {
        const axiosError = error;
        res.status(500).json({
            message: axiosError.message,
        });
    }
}));
app.get("/api/getAllLocations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, getAllLocations_1.getAllLocations)();
        res.status(200).json(result);
    }
    catch (error) {
        const axiosError = error;
        res.status(500).json({
            message: axiosError.message,
        });
    }
}));
app.get("/api/getPostcodeSuggestions", [
    (0, express_validator_1.query)("query")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Search query is required."),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const result = yield (0, getPostcodeSuggestions_1.getPostcodeSuggestions)(query);
        res.status(200).json(result);
    }
    catch (error) {
        const axiosError = error;
        res.status(500).json({
            message: axiosError.message,
        });
    }
}));
module.exports = app;
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map