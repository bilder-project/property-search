import {
  Controller,
  Get,
  Query,
  BadGatewayException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBadGatewayResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Property } from './models/property.model';
import { Counter, Histogram, Registry } from 'prom-client';

@Controller('property-search')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('http_requests_total') private readonly counter: Counter<string>,
    @Inject('http_request_duration_seconds')
    private readonly histogram: Histogram<string>,
    @Inject('PrometheusRegistry') private readonly registry: Registry, // Inject the Prometheus registry
  ) {}

  // Get all properties with optional query filters
  @Get('search')
  @ApiOkResponse({
    type: Property,
    isArray: true,
    description: 'Get all properties with optional query filters',
  })
  @ApiBadGatewayResponse({
    description: 'Bad Gateway',
    type: BadGatewayException,
  })
  @ApiNotFoundResponse({ description: 'Not Found', type: NotFoundException })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'User ID to get recommendations for',
  })
  @ApiQuery({
    name: 'searchQuery',
    required: false,
    type: String,
    description: 'Query to search for',
  })
  @ApiQuery({
    name: 'locationLat',
    required: false,
    type: Number,
    description: 'Latitude of the location to search around',
  })
  @ApiQuery({
    name: 'locationLon',
    required: false,
    type: Number,
    description: 'Longitude of the location to search around',
  })
  @ApiQuery({
    name: 'locationMaxDistance',
    required: false,
    type: Number,
    description: 'Maximum distance from the location to search around',
  })
  @ApiQuery({
    name: 'types',
    required: false,
    type: [String],
    description: 'Types of properties to search for',
  })
  @ApiQuery({
    name: 'priceMin',
    required: false,
    type: Number,
    description: 'Minimum price of the property',
  })
  @ApiQuery({
    name: 'priceMax',
    required: false,
    type: Number,
    description: 'Maximum price of the property',
  })
  @ApiQuery({
    name: 'sizeMin',
    required: false,
    type: Number,
    description: 'Minimum size of the property',
  })
  @ApiQuery({
    name: 'sizeMax',
    required: false,
    type: Number,
    description: 'Maximum size of the property',
  })
  async searchProperties(
    @Query('userId') userId?: string,
    @Query('searchQuery') searchQuery?: string,
    @Query('locationLat') locationLat?: string,
    @Query('locationLon') locationLon?: string,
    @Query('locationMaxDistance') locationMaxDistance?: number,
    @Query('types') types?: string[],
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
    @Query('sizeMin') sizeMin?: number,
    @Query('sizeMax') sizeMax?: number,
  ) {
    const start = Date.now(); // Start measuring time
    try {
      typeof types === 'string' ? (types = [types]) : types;
      const result = this.appService.getProperties({
        userId,
        searchQuery,
        locationLat: parseFloat(locationLat),
        locationLon: parseFloat(locationLon),
        locationMaxDistance,
        types,
        priceMin,
        priceMax,
        sizeMin,
        sizeMax,
      });
      // Increment counter for successful requests
      this.counter.labels('GET', '/search', '200').inc();
      return result;
    } catch (error) {
      // Increment counter for failed requests
      this.counter.labels('GET', '/search', '500').inc();
      throw error;
    } finally {
      const duration = (Date.now() - start) / 1000; // Calculate duration in seconds
      this.histogram.labels('GET', '/search', '200').observe(duration);
    }
  }

  @Get('recommendations')
  @ApiOkResponse({
    type: Property,
    isArray: true,
    description: 'Get all properties with optional query filters',
  })
  @ApiBadGatewayResponse({
    description: 'Bad Gateway',
    type: BadGatewayException,
  })
  @ApiNotFoundResponse({ description: 'Not Found', type: NotFoundException })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
    description: 'User ID to get recommendations for',
  })
  async getRecommendations(@Query() userId: string) {
    const start = Date.now();

    try {
      const result = await this.appService.getRecommendedProperties(userId);

      // Increment counter for successful requests
      this.counter.labels('GET', '/recommendations', '200').inc();
      return result;
    } catch (error) {
      // Increment counter for failed requests
      this.counter.labels('GET', '/recommendations', '500').inc();
      throw error;
    } finally {
      const duration = (Date.now() - start) / 1000;
      this.histogram.labels('GET', '/recommendations', '200').observe(duration);
    }
  }

  @Get('health')
  healthCheck() {
    return this.appService.healthCheck();
  }

}
