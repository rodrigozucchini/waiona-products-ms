import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
import { MetricsInterceptor } from './metrics.interceptor';

@Module({
  imports: [PrometheusModule.register()],
  providers: [
    makeCounterProvider({
      name: 'grpc_messages_total',
      help: 'Total de llamadas gRPC procesadas por products-ms',
      labelNames: ['pattern', 'status'],
    }),
    makeHistogramProvider({
      name: 'grpc_message_duration_seconds',
      help: 'Duración de procesamiento de llamadas gRPC en segundos',
      labelNames: ['pattern'],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    }),
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class MetricsModule {}
