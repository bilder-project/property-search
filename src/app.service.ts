import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { Filter } from './models/filters.model';
import axios from 'axios';

@Injectable()
export class AppService {
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  async getProperties(filters: Filter) {
    return this.supabaseService.fetchProperties(filters);
  }

  async getRecommendedProperties(userId: any) {
    try {
      console.log('Generating recommendations for user:', userId.userId); // Log the user ID
      const response = await axios.post(
        `${this.supabaseUrl}/functions/v1/generate-recommendations`,
        {
          userId: userId.userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            apikey: this.supabaseKey,
            Authorization: `Bearer ${this.supabaseKey}`,
          },
        },
      );
      
      console.log(response.data); // Log the response data
      return response.data; // Return the response data
    } catch (error) {
      console.error(error.response?.data || error.message); // Log error details
      throw error;
    }
  }

  async healthCheck() {
    return { status: 'ok' };
  }
}
