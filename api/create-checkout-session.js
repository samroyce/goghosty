import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { email, phone } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    metadata: { phone },
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "GoGhosty Exposure Report" },
        unit_amount: 2900
      },
      quantity: 1
    }],
    success_url: "https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://yourdomain.com"
  });

  res.json({ url: session.url });
}