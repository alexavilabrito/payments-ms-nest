
import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        console.error("payment-ms:create");


        //console.error({ response });

        const rpcError = exception.getError();

        //console.error('rpcError', rpcError);

        if( typeof rpcError === 'object' && 
            'status' in rpcError && 
            'message' in rpcError 
        ) {
            return response.status( rpcError.status ).json({    
                statusCode: rpcError.status,
                message: rpcError.message,
            });
        }



        response.status( 400 ).json({    
            statusCode: 400,
            message: exception.message,
         });
    
        return response;

    }
}
