"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ssl_service_1 = require("../ssl/ssl.service");
const uuid_1 = require("uuid");
const initPayment = (user, amount, expiresInDays) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = `Street-Food-Discovery-Website-${(0, uuid_1.v4)()}`;
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
    });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    const newSubscription = yield prisma_1.default.payment.create({
        data: {
            amount,
            paymentId: transactionId,
            userId: userData.id,
            expiresAt,
            status: "UNPAID",
        },
    });
    const initPaymentData = {
        amount,
        transactionId: transactionId,
        name: userData.name || "Unknown",
        email: userData.email,
        address: "N/A",
        phoneNumber: "N/A",
        userId: userData.id,
        expiresIn: expiresInDays,
    };
    const result = yield ssl_service_1.SSLService.initPayment(initPaymentData);
    return {
        paymentUrl: result,
    };
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPayment = yield tx.payment.update({
            where: {
                paymentId: payload.tran_id,
            },
            data: {
                status: "PAID",
            },
        });
        const sub = yield tx.subscription.create({
            data: {
                userId: updatedPayment.userId,
                paymentId: updatedPayment.paymentId,
                subcriptionStatus: "ACTIVE",
                expiresAt: updatedPayment.expiresAt,
                status: "PAID",
            },
        });
        yield tx.user.update({
            where: {
                id: updatedPayment.userId,
            },
            data: {
                isPremium: true,
            },
        });
    }));
    // return {
    //   message: "Payment successful!",
    // };
    return true;
});
exports.PaymentService = {
    initPayment,
    validatePayment,
};
