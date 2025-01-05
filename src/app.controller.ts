import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('properties')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Get all properties with optional query filters
  @Get()
  async searchProperties(
    @Query('locationLat') locationLat?: string,
    @Query('locationLon') locationLon?: string,
    @Query('locationMaxDistance') locationMaxDistance?: number,
    @Query('types') types?: string[],
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
    @Query('sizeMin') sizeMin?: number,
    @Query('sizeMax') sizeMax?: number,
  ) {
    return this.appService.getProperties({
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
