import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { Filter } from './models/filters.model';
import axios from 'axios';
import { Kafka } from 'kafkajs';

@Injectable()
export class AppService {
  private supabaseUrl: string;
  private supabaseKey: string;
  private kafka: any;
  private producer: any;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.kafka = new Kafka({
      clientId: 'property-search',
      brokers: [`${process.env.KAFKA_BROKER}:${process.env.KAFKA_PORT}`],
    });
    this.producer = this.kafka.producer();
  }

  async getProperties(filters: Filter) {
    await this.sendToKafka('property-search-events', JSON.stringify(filters));
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

  async sendToKafka(topic: string, message: string) {
    await this.producer.connect();
    await this.producer.send({
      groupId: 'logging-service-group',
      topic: topic,
      messages: [{ value: message }],
    });
    await this.producer.disconnect();
  }

  async healthCheck() {
    return { status: 'ok' };
  }
}
