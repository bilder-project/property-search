import { createClient } from '@supabase/supabase-js';
import { Filter } from './models/filters.model';
import { ConfigService } from '@nestjs/config';

export class SupabaseService {
  private supabase;

  constructor() {
    const supabaseUrl = 'https://dqundwtpkgtfhreonqkd.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxdW5kd3Rwa2d0ZmhyZW9ucWtkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTE2NDk0OCwiZXhwIjoyMDQ2NzQwOTQ4fQ.sqyQIH8aH1mEQ_5iJg5xjjNR-bhgxxLG759L3BzhFNg';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async fetchPropertiesByLocation(lat: number, lon: number, radius: number) {
    const { data, error } = await this.supabase.rpc('search_by_location', {
      user_lat: lat,
      user_lon: lon,
      search_radius: radius, // in meters
    });

    if (error) return { data: null, error: error };
    return { data: data, error: null };
  }

  // Fetch all properties with optional filters
  async fetchProperties(filters: Filter) {
    const query = this.supabase.from('properties').select('*');

    if (filters.searchQuery) {
        query.textSearch('name', filters.searchQuery);
    }

    if (filters.locationLat && filters.locationLon) {
        const { data, error } = await this.fetchPropertiesByLocation(
            filters.locationLat,
            filters.locationLon,
            filters.locationMaxDistance || 10000
        );

        if (error) throw error;

        const propertyIds = data.map((property) => property.id);
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
