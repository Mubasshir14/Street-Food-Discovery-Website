import express from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/ipn", PaymentController.validatePayment);

// **/
// {
//     "amount": 500,
//     "expiresIn": 30
//   }

// **/

router.post(
  "/init-payment/:appointmentId",
  auth(UserRole.USER),
  PaymentController.initPayment
);

export const PaymentRoutes = router;
