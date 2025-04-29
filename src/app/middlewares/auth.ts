import { NextFunction, Request, Response } from "express";
import { jwtwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";

import httpStatus from "http-status";
import AppError from "../error/AppError";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You Are Not Authprized");
      }
      const verifieduser = jwtwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );

      req.user = verifieduser;

      if (roles.length && !roles.includes(verifieduser.role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You Are Not Authprized");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
export default auth;
