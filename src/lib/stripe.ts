import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_API_KEY as string,{
    apiVersion:'2024-06-20',
    typescript:true
})

export const portal=stripe.billingPortal.sessions.create.bind(stripe.billingPortal.sessions)
export const checkout=stripe.checkout.sessions.create.bind(stripe.checkout.sessions)
