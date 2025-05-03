import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const createSubscription = async (
  user: IAuthUser,
  amount: number,
  expiryDays: number
) => {
  const foundUser = await prisma.user.findUniqueOrThrow({
    where: { email: user?.email },
  });

  const now = new Date();
  const transactionId = `FOODWEBSITE-${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  const subscription = await prisma.subscription.create({
    data: {
      userId: foundUser.id,
      paymentId: transactionId,
      status: "UNPAID",
      subcriptionStatus: "ACTIVE",
      expiresAt: expiresAt,
    },
    include: {
      user: true,
    },
  });

  return {
    transactionId,
    subscription,
    amount,
  };
};

export const SubscriptionService = {
  createSubscription,
};
