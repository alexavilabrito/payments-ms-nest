import 'dotenv/config';
import * as Joi from 'joi';

/*
* Define the shape of the environment variables
* and validate them using Joi
*/
interface EnvVars {
    PORT: number;
    NODE_ENV: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_SUCCESS_URL: string;
    STRIPE_CANCEL_URL: string;
    STRIPRE_ENDPOINT_SECRET: string;


    NATS_SERVERS: string[];
}


/*
* Validate the environment variables
*/
const envsSchema = Joi.object({
    PORT: Joi.number().required(),
    NODE_ENV: Joi.string().valid('development', 'production').default('development'),
    STRIPE_SECRET_KEY: Joi.string().required(),
    STRIPE_SUCCESS_URL: Joi.string().required(),
    STRIPE_CANCEL_URL: Joi.string().required(),
    STRIPRE_ENDPOINT_SECRET: Joi.string().required(),
    NATS_SERVERS: Joi.array().items(Joi.string()).required()
    
}).unknown( true );

/*
* Validate the environment variables
*/
const { error, value } = envsSchema.validate({ 
    ... process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});


/*  
* Throw an error if the environment variables are not valid
*/
if( error ) {
    throw new Error(`Config validation error: ${error.message}`);
}

/*
* Assign the environment variables to a constant
*/
const envVars: EnvVars = value;


/* 
* Export the environment variables
*/
export const envs = {
    port: envVars.PORT || 3000,
    nodeEnv: envVars.NODE_ENV || 'development',
    stripeSecretKey: envVars.STRIPE_SECRET_KEY,
    stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
    stripeCancelUrl: envVars.STRIPE_CANCEL_URL,
    stripeEndpointSecret: envVars.STRIPRE_ENDPOINT_SECRET,
    natServers: envVars.NATS_SERVERS
}