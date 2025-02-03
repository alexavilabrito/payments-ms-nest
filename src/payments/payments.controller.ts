import { Body, Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  
  private readonly looger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) { }




  //@Post('create-payment-session')
  @MessagePattern('create.payment.session')
  async createPaymentSession(
    @Payload() paymentSessionDto: PaymentSessionDto
  ) {

    this.looger.log('llegue al controller');

    this.looger.log(`createPaymentSession: ${JSON.stringify(paymentSessionDto)}`);

    return this.paymentsService.createPaymentSession(paymentSessionDto);

  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'success'
    };
  }

  @Get('cancelled')
  cancel() {
    return {
      ok: true,
      message: 'Payment cancelled'
    };
  }


  @Post('webhook')
  async stripeWebhook(@Req() request: Request, @Res() response: Response) {

    return this.paymentsService.stripeWebhook(request, response);
  }


}


