import { createClient } from '@supabase/supabase-js';
import { Filter } from './filters.model';

export class SupabaseService {
  private supabase;

  constructor() {
    const supabaseUrl = 'https://dqundwtpkgtfhreonqkd.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async fetchPropertiesByLocation(lat: number, lon: number, radius: number) {
    const { data, error } = await this.supabase.rpc('search_by_location', {
      user_lat: lat,
      user_lon: lon,
      search_radius: radius, // in meters
    });

    if (error) throw error;
    return data;
  }

  // Fetch all properties with optional filters
  async fetchProperties(filters: Filter) {
    const query = this.supabase.from('properties').select('*');

    if (filters.locationLat && filters.locationLon) {
        const { data: properties, error } = await this.fetchPropertiesByLocation(
            filters.locationLat,
            filters.locationLon,
            filters.locationMaxDistance || 10000
        );

        if (error) throw error;

        const propertyIds = properties.map((property) => property.id);
        query.in('id', propertyIds);
    } 
    if (filters.types) {
      query.in('type', filters.types);
    }
    if (filters.priceMin) {
      query.gte('price', filters.priceMin);
    }
    if (filters.priceMax) {
      query.lte('price', filters.priceMax);
    }
    if (filters.sizeMin) {
      query.gte('size', filters.sizeMin);
    }
    if (filters.sizeMax) {
      query.lte('size', filters.sizeMax);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}
