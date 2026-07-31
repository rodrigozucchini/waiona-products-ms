import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import type { Counter, Histogram } from 'prom-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('nats_messages_total')
    private readonly messagesCounter: Counter<string>,
    @InjectMetric('nats_message_duration_seconds')
    private readonly messageDuration: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'rpc') {
      return next.handle();
    }

    const rpcContext: any = context.switchToRpc().getContext();
    const pattern: string = rpcContext?.getSubject?.() ?? 'unknown';
    const stopTimer = this.messageDuration.startTimer({ pattern });

    return next.handle().pipe(
      tap({
        next: () => {
          this.messagesCounter.inc({ pattern, status: 'success' });
          stopTimer();
        },
        error: () => {
          this.messagesCounter.inc({ pattern, status: 'error' });
          stopTimer();
        },
      }),
    );
  }
}
