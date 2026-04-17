import Stripe from "stripe";
import { Resend } from "resend";
import brokers from "./brokers.json";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  const session = await stripe.checkout.sessions.retrieve(session_id);

  const email = session.customer_email;
  const phone = session.metadata.phone;

  const report = generateReport(email, phone);

  await resend.emails.send({
    from: "report@goghosty.com",
    to: email,
    subject: "Your GoGhosty Exposure Report",
    html: report
  });

  res.send("Report sent");
}

function generateReport(email, phone) {
  return `
  <div style="font-family:Arial; padding:20px;">
    <h2>GoGhosty Exposure Report</h2>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>

    <h3>Exposure Summary</h3>
    <p>Likely exposed on multiple data broker platforms.</p>

    <h3>Removal Links</h3>
    ${brokers.map(b => `<p><a href="${b.optout}">${b.name}</a></p>`).join("")}
  </div>
  `;
}