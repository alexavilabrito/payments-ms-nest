import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Payments-ms');

  logger.log(`NATS_SERVERS: ${envs.natServers}`);


  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );


  /*
  * Connect to the NATS server
  * configuracion para microservicios hybridos
  *  inheritAppConfig: true , comparte la configuracion de la validacion
  */
  app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: envs.natServers ,
      }
    }, {
      inheritAppConfig: true
    }
  );


  await app.startAllMicroservices();

  await app.listen(envs.port);

  logger.log(`Payments Microservice running on port ${envs.port}`);
}
bootstrap();
