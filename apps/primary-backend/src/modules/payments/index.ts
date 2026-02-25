import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { paymentModels } from "./model";
import { paymentServices } from "./service";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const app = new Elysia({ prefix: "payment" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )
  .resolve(async ({ jwt, cookie: { auth }, status }) => {
    if (!auth) {
      return status(401);
    }

    const decoded = await jwt.verify(auth.value as string);

    if (!decoded || !decoded.userId) {
      return status(401);
    }

    return {
      userId: decoded.userId as string,
    };
  })
  .post(
    "/onramp",
    async ({ userId, status }) => {
      try {
        const credits = await paymentServices.OnrampOperation(Number(userId));
        return {
          message: "Payment sucessful!!!",
          credits,
        };
      } catch (error) {
        console.log(error);
        return status(411, { message: "Payment unsucessful!!!" });
      }
    },
    {
      response: {
        200: paymentModels.paymentSuccessfulResponse,
        411: paymentModels.paymentFailedResponse,
      },
    },
  )
  .post(
    "/checkout",
    async ({ userId, body }) => {
      const session = await stripe.checkout.sessions.create({
        customer_email: body.email,
        adaptive_pricing: {
          enabled: true,
        },
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "API credit" },
              unit_amount: 1000,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: { userId: userId, credit: 1000 },
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      });

      return { url: session.url };
    },
    {
      body: paymentModels.stripePaymentSchema,
    },
  )
  .post(
    "/webhook",
    async ({ headers, status, request }) => {
      const signature = headers["stripe-signature"];
      const webhookSecret = process.env.WEBHOOK_SECRET!;
      if (!signature || !webhookSecret) {
        return status(400, {
          message: "Signature is missing!",
        });
      }

      const arrayBuffer = await request.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          buffer,
          signature,
          webhookSecret,
        );
      } catch (error) {
        return status(400, {
          message: "Signature is missing!",
        });
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata) {
          const credit = await paymentServices.onrampStripeOperation(
            Number(session.metadata.userId),
            Number(session.metadata.credit),
          );
          return status(200, {
            message: "Credit updated Succesfully!",
            credit,
          });
        }
      }

      return status(200, {
        message: "Credit updated Succesfully!",
        credit: 0,
      });
    },

    {
      parse: (c) => {},
      response: {
        200: paymentModels.webhookSuccessrResponseSchema,
        400: paymentModels.webhookFailderResponseSchema,
      },
    },
  );
