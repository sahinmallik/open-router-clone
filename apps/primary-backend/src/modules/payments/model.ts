import { t } from "elysia";

export namespace paymentModels {
  export const paymentSuccessfulResponse = t.Object({
    message: t.Literal("Payment sucessful!!!"),
    credits: t.Number(),
  });

  export type paymentSuccessfulResponse =
    typeof paymentSuccessfulResponse.static;

  export const paymentFailedResponse = t.Object({
    message: t.Literal("Payment unsucessful!!!"),
  });

  export type paymentFailedResponse = typeof paymentFailedResponse.static;

  export const stripePaymentSchema = t.Object({
    email: t.String(),
    userId: t.Number(),
  });

  export type stripePaymentSchema = typeof stripePaymentSchema.static;
  export const webhookSuccessrResponseSchema = t.Object({
    message: t.Literal("Credit updated Succesfully!"),
    credit: t.Number(),
  });
  export type webhookSuccessrResponseSchema =
    typeof webhookSuccessrResponseSchema.static;
  export const webhookFailderResponseSchema = t.Object({
    message: t.Literal("Signature is missing!"),
  });

  export type webhookFailderResponseSchema =
    typeof webhookFailderResponseSchema.static;
}
