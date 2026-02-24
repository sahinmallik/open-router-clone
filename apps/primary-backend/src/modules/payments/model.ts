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
}
