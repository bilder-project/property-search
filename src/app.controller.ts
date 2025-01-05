import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBadGatewayResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Property } from './models/property.model';

@Controller('properties')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Get all properties with optional query filters
  @Get('search')
  @ApiOkResponse({
    type: Property,
    description: 'Get all properties with optional query filters',
  })
  @ApiBadGatewayResponse({ description: 'Bad Gateway', type: BadGatewayException })
  @ApiNotFoundResponse({ description: 'Not Found', type: NotFoundException  })
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
    typeof types === 'string' ? types = [types] : types;
    return this.appService.getProperties({
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
  }

}
