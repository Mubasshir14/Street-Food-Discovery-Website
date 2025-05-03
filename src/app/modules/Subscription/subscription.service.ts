// import SSLCommerzPayment from "sslcommerz-lts";
import { PrismaClient } from "@prisma/client";
import config from "../../../config";

const prisma = new PrismaClient();

// const initiatePayment = async (userId: string, amount: number) => {
//   const tran_id = `TXN_${Date.now()}_${Math.random()
//     .toString(36)
//     .substring(2, 9)}`;
//   const user = await prisma.user.findUnique({ where: { id: userId } });
//   if (!user) throw new Error("User not found");

//   const data = {
//     store_id: config.sslCommerz.store_id,
//     store_passwd: config.sslCommerz.store_password,
//     total_amount: amount,
//     currency: "BDT",
//     tran_id,
//     success_url: config.sslCommerz.success_url,
//     fail_url: config.sslCommerz.failed_url,
//     cancel_url: config.sslCommerz.cancel_url,
//     ipn_url: "http://localhost:3000/api/subscription/ipn",
//     shipping_method: "NO",
//     product_name: "Premium Subscription",
//     product_category: "Subscription",
//     product_profile: "general",
//     cus_name: user.name || "Customer",
//     cus_email: user.email,
//     cus_add1: "Dhaka",
//     cus_city: "Dhaka",
//     cus_country: "Bangladesh",
//     cus_phone: "01711111111",
//   };

//   const sslcz = new SSLCommerzPayment(
//     config.sslCommerz.store_id,
//     config.sslCommerz.store_password,
//     config.sslCommerz.is_live
//   );
//   const apiResponse = await sslcz.init(data);

//   if (apiResponse.GatewayPageURL) {
//     await prisma.subscription.create({
//       data: {
//         userId,
//         paymentId: tran_id,
//         status: "PENDING",
//         expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//       },
//     });
//     return apiResponse.GatewayPageURL;
//   } else {
//     throw new Error("Failed to initiate payment");
//   }
// };

const updateSubscriptionStatus = async (
  paymentId: string,
  status: "ACTIVE" | "CANCELLED" | "EXPIRED"
) => {
  const subscription = await prisma.subscription.findUnique({
    where: { paymentId },
  });
  if (!subscription) throw new Error("Subscription not found");

  await prisma.subscription.update({
    where: { paymentId },
    data: { status, updatedAt: new Date() },
  });

  if (status === "ACTIVE") {
    await prisma.user.update({
      where: { id: subscription.userId },
      data: { isPremium: true },
    });
  } else if (status === "CANCELLED" || status === "EXPIRED") {
    await prisma.user.update({
      where: { id: subscription.userId },
      data: { isPremium: false },
    });
  }
};

const getUserSubscriptions = async (userId: string) => {
  return prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const SubcriptionService = {
//   initiatePayment,
  updateSubscriptionStatus,
  getUserSubscriptions,
};
