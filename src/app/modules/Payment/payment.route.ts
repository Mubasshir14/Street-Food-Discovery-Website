import express from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = express.Router();

router.post("/ipn", PaymentController.validatePayment);

// **/
// {
//     "amount": 500,
//     "expiresIn": 30
//   }

// **/

router.post(
  "/init-payment",
  auth(UserRole.USER),
  PaymentController.initPayment
);

export const PaymentRoutes = router;
