export interface Filter {
  userId?: string;
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
