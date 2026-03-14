import Stripe from "stripe";
import { serve } from "https://deno.land/std/http/server.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  try {
    const body = await req.json();
    const amount = body.amount;

    if (!amount) {
      return new Response("Amount required", { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "pkr",
      automatic_payment_methods: { enabled: true },
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
});
