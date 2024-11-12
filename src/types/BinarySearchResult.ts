import { NearestLocation } from "./NearestLocation";

export type BinarySearchResult = {
  locations: NearestLocation[];
  radiusToExcludeFromSearch: number;
  numberOfCallsMade: number;
};
