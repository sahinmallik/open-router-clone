import { prisma } from "db";

const API_KEY_LENGTH = 100;
const API_KEY_GENERATOR_STRING =
  "qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM12345678900987654321QWERTYUIOPASDFGHJKLMNBVCXZsdfghgfdsxcvhjkmnbvcfgyuiuytfdghjkmnbvgSERTYUIKUYTRESZXCVGHJUI87654345678908UYGHJKMNBVCXSWE3Eiuytrdsfghjkmnbvcde3234567890okjuytredcvgbhjkiu7654edfAQASDXZXCVBNMKLO98U7YTREWSDFGHJNHYTRESDFG";
export abstract class ApiKeyServies {
  static generateApikey() {
    let suffix = "";
    for (let i = 0; i < API_KEY_LENGTH; i++) {
      suffix +=
        API_KEY_GENERATOR_STRING[
          Math.floor(Math.random() * API_KEY_GENERATOR_STRING.length)
        ];
    }
    return `sk-or-v1-${suffix}`;
  }

  static async createApikey(
    name: string,
    userId: number,
  ): Promise<{ id: number; apiKey: string }> {
    const apiKey = ApiKeyServies.generateApikey();
    const apiKeyDb = await prisma.apiKey.create({
      data: {
        name,
        apiKey,
        userId,
      },
    });
    return {
      id: apiKeyDb.id,
      apiKey,
    };
  }

  static async getAllApiKeys(userId: number): Promise<
    {
      id: number;
      name: string;
      apiKey: string;
      creditConsumed: number;
      lastUsed: Date;
      disabled: boolean;
    }[]
  > {
    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId,
        deleted: false,
      },
    });

    return apiKeys.map((apiKey) => ({
      id: apiKey.id,
      apiKey: apiKey.apiKey,
      name: apiKey.name,
      creditConsumed: apiKey.creditUsed,
      lastUsed: apiKey.lastUsed,
      disabled: apiKey.disabled,
    }));
  }

  static async updateApiKey(
    apiKeyId: number,
    userId: number,
    disabled: boolean,
  ) {
    await prisma.apiKey.update({
      where: {
        id: apiKeyId,
        userId,
      },
      data: {
        disabled,
      },
    });
  }

  static async deleteApiKey(id: number, userId: number) {
    await prisma.apiKey.update({
      where: {
        id,
        userId,
      },
      data: {
        deleted: true,
      },
    });
  }
}
