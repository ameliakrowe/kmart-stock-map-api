import express, { Request, Response } from "express";
import cors from "cors";
import { getPostcodeSuggestions } from "./getPostcodeSuggestions";
import { AxiosError } from "axios";

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: ["http://localhost:3005", "https://kmart-stock-map.vercel.app/"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    optionsSuccessStatus: 200,
  })
);

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

/*app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});*/

module.exports = app;
app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
