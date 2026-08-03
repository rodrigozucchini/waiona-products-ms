import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';

/**
 * gRPC no tiene el concepto {status, message} que usa RpcException — solo un
 * código canónico + `details` (string). En vez de reescribir cada throw en
 * los services, viajamos el status HTTP-shaped original codificado en
 * `details` como "status|message", y el gateway lo desarma en rpc-error.filter.ts.
 * (mismo diseño que auth-ms/src/auth/filters/grpc-exception.filter.ts)
 */
@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<never> {
    const error = exception.getError();
    const { httpStatus, message } =
      typeof error === 'object' && error !== null
        ? {
            httpStatus: (error as { status?: number }).status ?? 500,
            message: (error as { message?: string }).message ?? 'Error',
          }
        : { httpStatus: 500, message: String(error) };

    return throwError(() => ({
      code: status.UNKNOWN,
      details: `${httpStatus}|${message}`,
    }));
  }
}
