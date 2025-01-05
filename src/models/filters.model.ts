export interface Filter {
  searchQuery?: string;
  locationLat?: number;
  locationLon?: number;
  locationMaxDistance?: number;
  types?: string[];
  priceMin?: number;
  priceMax?: number;
  sizeMin?: number;
  sizeMax?: number;
}
