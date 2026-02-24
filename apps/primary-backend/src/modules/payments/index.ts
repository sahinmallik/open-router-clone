import jwt from "@elysiajs/jwt";
import { secrets } from "bun";
import Elysia from "elysia";
import { paymentModels } from "./model";
import { paymentServices } from "./service";

export const app = new Elysia({ prefix: "payment" })
  .use(
    jwt({
      name: "jwt",
      secret: "Bristi",
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
  );
