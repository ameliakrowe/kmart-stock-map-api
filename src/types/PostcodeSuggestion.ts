import { Coord } from "Coord";

export type PostcodeSuggestion = {
  postcode: string;
  suburb: string;
  state: string;
  location: Coord;
};
