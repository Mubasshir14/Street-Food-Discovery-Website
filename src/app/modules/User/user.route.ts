import express, { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import { UserValidation } from "./user.validation";
import { FileUploader } from "../../../helpers/fileUploader";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), UserController.getAllFromDB);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.USER),
  UserController.getMyProfile
);
router.post(
  "/create-admin",
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createUser.parse(JSON.parse(req.body.data));
    return UserController.createAdmin(req, res, next);
  }
);

router.post(
  "/create-user",
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createUser.parse(JSON.parse(req.body.data));
    return UserController.createUser(req, res, next);
  }
);

router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  UserController.changeProfileStatus
);

router.patch(
  "/update-my-profile",
  auth(UserRole.ADMIN, UserRole.USER),
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.updateMyProfile(req, res, next);
  }
);

export const UserRoutes = router;
