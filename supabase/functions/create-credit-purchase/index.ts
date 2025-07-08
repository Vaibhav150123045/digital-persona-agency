
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://cdn.skypack.dev/stripe@14.21.0";
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, price } = await req.json();

    if (!amount || !price) {
      throw new Error('Amount and price are required');
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user info from request headers
    const authHeader = req.headers.get('authorization');
    let userEmail = 'guest@example.com'; // Default for anonymous users
    let userId = null;

    if (authHeader) {
      try {
        const jwt = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(jwt);
        if (user) {
          userId = user.id;
          userEmail = user.email || userEmail;
        }
      } catch (error) {
        console.log('Auth parsing failed, treating as anonymous user');
      }
    }

    console.log('Creating credit purchase for:', userEmail, 'Amount:', amount, 'Price:', price);

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create a one-time payment session for credits
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: `${amount} Chat Credits`,
              description: `Purchase ${amount} additional chat messages`
            },
            unit_amount: price, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/credit-success?credits=${amount}`,
      cancel_url: `${req.headers.get("origin")}/`,
      metadata: {
        type: 'credit_purchase',
        credits: amount.toString(),
        user_email: userEmail,
        user_id: userId || 'anonymous'
      }
    });

    console.log('Credit purchase session created:', session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Credit purchase error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create credit purchase session'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
