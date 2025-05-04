"use strict";
// import jwt, { JwtPayload, Secret } from "jsonwebtoken";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
// const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
//   const token = jwt.sign(payload, secret, {
//     algorithm: "HS256",
//     expiresIn,
//   });
//   return token;
// };
// const verifyToken = (token: string, secret: Secret) => {
//   return jwt.verify(token, secret) as JwtPayload;
// };
// export const jwtwtHelpers = {
//   generateToken,
//   verifyToken
// };
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn,
    });
    return token;
};
const verifyToken = (authorizationHeader, secret) => {
    if (!authorizationHeader) {
        throw new Error("Authorization header is missing");
    }
    const splitToken = authorizationHeader.split(" ");
    if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
        throw new Error("Invalid token format");
    }
    const accessToken = splitToken[1];
    return jsonwebtoken_1.default.verify(accessToken, secret);
};
exports.jwtHelpers = {
    generateToken,
    verifyToken,
};
