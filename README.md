# Payments Services



## Test

- Pasarela de Pago 

https://dashboard.stripe.com/test/dashboard

ejecutar para el webhook

```
stripe listen --forward-to localhost:3003/payments/webhook
```

- Configuracion de forwarding.


https://dashboard.hookdeck.com/signin


```
hookdeck listen 3003 stripe-to-localhost
```
