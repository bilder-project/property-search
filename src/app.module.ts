import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram, Registry } from 'prom-client';

@Module({
  imports: [ConfigModule.forRoot(), PrometheusModule.register({
    path: '/property-search/metrics', // Specify the new path
  })],
  controllers: [AppController],
  providers: [
    AppService,
    SupabaseService,
    {
      provide: 'PrometheusRegistry',
      useFactory: () => {
        return new Registry(); // Create a new Registry instance if necessary
      },
    },
    {
      provide: 'http_requests_total',
      useFactory: (registry: Registry) => {
        const counter = new Counter({
          name: 'http_requests_total',
          help: 'Total number of HTTP requests',
          labelNames: ['method', 'route', 'status_code'],
        });
        registry.registerMetric(counter);
        return counter;
      },
      inject: ['PrometheusRegistry'],
    },
    {
      provide: 'http_request_duration_seconds',
      useFactory: (registry: Registry) => {
        const histogram = new Histogram({
          name: 'http_request_duration_seconds',
          help: 'Histogram of HTTP request durations',
          labelNames: ['method', 'route', 'status_code'],
          buckets: [0.1, 0.5, 1, 2, 5, 10],
        });
        registry.registerMetric(histogram);
        return histogram;
      },
      inject: ['PrometheusRegistry'],
    },
  ],
})
export class AppModule {}
