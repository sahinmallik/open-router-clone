import { prisma } from "db";

export abstract class paymentServices {
  static async OnrampOperation(userId: number) {
    const [user] = await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            increment: 1000,
          },
        },
      }),
      prisma.onrampTransaction.create({
        data: {
          userId,
          amount: 1000,
          status: "Completed",
        },
      }),
    ]);
    return user.credits;
  }

  static async onrampStripeOperation(userId: number, credit: number) {
    const [user] = await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            increment: credit,
          },
        },
      }),
      prisma.onrampTransaction.create({
        data: {
          userId,
          amount: 1000,
          status: "Completed",
        },
      }),
    ]);
    return user.credits;
  }
}
