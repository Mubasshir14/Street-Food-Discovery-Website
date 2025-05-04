"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const prisma_1 = require("../../../../generated/prisma");
const router = express_1.default.Router();
router.post("/ipn", payment_controller_1.PaymentController.validatePayment);
// **/
// {
//     "amount": 500,
//     "expiresIn": 30
//   }
// **/
router.post("/init-payment", (0, auth_1.default)(prisma_1.UserRole.USER), payment_controller_1.PaymentController.initPayment);
exports.PaymentRoutes = router;
