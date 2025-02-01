import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import e, { Request, Response } from 'express';
import { env } from 'process';

@Injectable()
export class PaymentsService {




    private readonly stripe = new Stripe(envs.stripeSecretKey);


    async createPaymentSession(paymentSessionDto: PaymentSessionDto) {


        const { currency, items } = paymentSessionDto;

        const line_items = items.map(item => {
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price * 100),   // 20.00  - 2000 / 100 = 20.00
                },
                quantity: item.quantity,
            }
        });

        const session = await this.stripe.checkout.sessions.create({
            //payment_method_types: ['card'],

            payment_intent_data: {
                metadata: {
                    orderId: paymentSessionDto.orderId,
                }
            },

            line_items: line_items,

            mode: 'payment',
            success_url: envs.stripeSuccessUrl,
            cancel_url:  envs.stripeCancelUrl,
        });

        return session;

    }

    async stripeWebhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'];
    
        let event: Stripe.Event;
    
        const endpointSecret = envs.stripeEndpointSecret;        
    
        try {
          event = this.stripe.webhooks.constructEvent(
            req['rawBody'],
            (sig === undefined ? '' : sig),
            endpointSecret,
          );
        } catch (err) {
            //console.error(`Webhook Error: ${err.message}`);
            res.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }

       

        //return res.status(200).json({ sig });
        
        
        switch( event.type ) {
          case 'charge.succeeded': 
            console.log( { event } );
            
            const chargeSucceeded = event.data.object;
          
            // TODO: llamar nuestro microservicio
            console.log({
              metadata: chargeSucceeded.metadata,
              orderId: chargeSucceeded.metadata.orderId,
            });
            

          break;
          
          default:
            console.log(`Event ${ event.type } not handled`);
        }
    
        return res.status(200).json({ sig });
        

      }
}


