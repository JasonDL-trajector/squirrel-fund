import Stripe from "stripe";
import { Config } from "sst/node/config";
import handler from "@squirrel-fund/core/handler";
import { calculateCost } from "@squirrel-fund/core/cost";

export const main = handler(async (event) => {
  const { storage, source } = JSON.parse(event.body || "{}");
  const amount = calculateCost(storage);
  const description = "Scratch charge";

  const stripe = new Stripe(Config.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "php",
  });

  return JSON.stringify({ status: true });
});