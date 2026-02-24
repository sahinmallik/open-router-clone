import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";
import { jwt } from "@elysiajs/jwt";

export const app = new Elysia({ prefix: "auth" })
  .use(
    jwt({
      name: "jwt",
      secret: "Bristi",
    }),
  )
  .post(
    "/sign-up",
    async ({ body, status }) => {
      try {
        const userId = await AuthService.signup(body.email, body.password);
        return {
          id: userId,
        };
      } catch (error) {
        return status(400, {
          message: "Error while signing up",
        });
      }
    },
    {
      body: AuthModel.signupSchema,
      response: {
        200: AuthModel.signupResponseSchema,
        400: AuthModel.signupFailedResponse,
      },
    },
  )
  .post(
    "/sign-in",
    async ({ body, jwt, cookie: { auth }, status }) => {
      const { correctCredential, userId } = await AuthService.signin(
        body.email,
        body.password,
      );
      if (correctCredential && userId) {
        const token = await jwt.sign({ userId });
        auth.set({
          value: token,
          httpOnly: true,
          maxAge: 7 * 86400,
        });
        return {
          message: "Signed in successfully",
        };
      } else {
        return status(403, {
          message: "Invalid Credentials",
        });
      }
    },
    {
      body: AuthModel.signinSchema,
      response: {
        200: AuthModel.signinResponseSchema,
        403: AuthModel.signinFailedResponse,
      },
    },
  );
