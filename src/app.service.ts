import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { Filter } from './models/filters.model';

@Injectable()
export class AppService {
  constructor(private readonly supabaseService: SupabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getProperties(filters: Filter) {
    return this.supabaseService.fetchProperties(filters);
  }

  async healthCheck() {
    return { status: 'ok' };
  }

}
