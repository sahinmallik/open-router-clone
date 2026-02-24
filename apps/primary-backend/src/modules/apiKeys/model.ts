import { t } from "elysia";

export namespace ApikeyModel {
  export const createApiKeySchema = t.Object({
    name: t.String(),
  });

  export type createApiKeySchema = typeof createApiKeySchema.static;

  export const createApiKeyResponseSchema = t.Object({
    id: t.Number(),
    apiKey: t.String(),
  });

  export type createApiKeyResponseSchema =
    typeof createApiKeyResponseSchema.static;

  export const getApiKeyResponse = t.Object({
    apiKeys: t.Array(
      t.Object({
        id: t.Number(),
        name: t.String(),
        apiKey: t.String(),
        creditConsumed: t.Number(),
        lastUsed: t.Nullable(t.Date()),
        disabled: t.Boolean(),
      }),
    ),
  });

  export type getApiKeyResponse = typeof getApiKeyResponse.static;

  export const updateApiKeySchema = t.Object({
    id: t.String(),
    disabled: t.Boolean(),
  });

  export type updateApiKeySchema = typeof updateApiKeySchema.static;

  export const updateApiKeyResponseSchema = t.Object({
    message: t.Literal("Updated api key successfully"),
  });

  export type updateApiKeyResponseSchema =
    typeof updateApiKeyResponseSchema.static;

  export const disableApiKeyResponseFailedSchema = t.Object({
    message: t.Literal("Updating api key unsuccessful"),
  });

  export type disableApiKeyResponseFailedSchema =
    typeof disableApiKeyResponseFailedSchema.static;

  export const deleteApiKeyResponse = t.Object({
    message: t.Literal("Api key is deleted successfully"),
  });

  export type deleteApiKeyResponse = typeof deleteApiKeyResponse.static;

  export const deleteApiKeyfaliedResponse = t.Object({
    message: t.Literal("Can not delete the api key"),
  });
  export type deleteApiKeyfaliedResponse =
    typeof deleteApiKeyfaliedResponse.static;
}
