import { ApikeyModel } from "./model";
import { jwt } from "@elysiajs/jwt";
import Elysia from "elysia";
import { ApiKeyServies } from "./service";

export const app = new Elysia({ prefix: "apikeys" })
  .use(
    jwt({
      name: "jwt",
      secret: "Bristi",
    }),
  )
  .resolve(async ({ jwt, status, cookie: { auth } }) => {
    if (!auth) {
      return status(401);
    }

    const decoded = await jwt.verify(auth.value as string);

    if (!decoded || !decoded.userId) {
      return status(401);
    }

    return { userId: decoded.userId as string };
  })
  .get(
    "/",
    async ({ userId }) => {
      const apiKeys = await ApiKeyServies.getAllApiKeys(Number(userId));
      return {
        apiKeys: apiKeys,
      };
    },
    {
      response: {
        200: ApikeyModel.getApiKeyResponse,
      },
    },
  )
  .post(
    "/",
    async ({ userId, body }) => {
      const { id, apiKey } = await ApiKeyServies.createApikey(
        body.name,
        Number(userId),
      );
      return {
        id,
        apiKey,
      };
    },
    {
      body: ApikeyModel.createApiKeySchema,
      response: {
        200: ApikeyModel.createApiKeyResponseSchema,
      },
    },
  )
  .put(
    "/",
    async ({ body, userId, status }) => {
      try {
        const apiKey = await ApiKeyServies.updateApiKey(
          Number(body.id),
          Number(userId),
          body.disabled,
        );
        return { message: "Updated api key successfully" };
      } catch (error) {
        return status(411, {
          message: "Updating api key unsuccessful",
        });
      }
    },
    {
      body: ApikeyModel.updateApiKeySchema,
      response: {
        200: ApikeyModel.updateApiKeyResponseSchema,
        411: ApikeyModel.disableApiKeyResponseFailedSchema,
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, userId, status }) => {
      try {
        await ApiKeyServies.deleteApiKey(Number(id), Number(userId));
        return {
          message: "Api key is deleted successfully",
        };
      } catch (err) {
        console.log(err);
        return status(411, {
          message: "Can not delete the api key",
        });
      }
    },
    {
      response: {
        200: ApikeyModel.deleteApiKeyResponse,
        411: ApikeyModel.deleteApiKeyfaliedResponse,
      },
    },
  );
