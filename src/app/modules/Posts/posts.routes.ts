import express, { NextFunction, Request, Response } from "express";
import { FileUploader } from "../../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import { PostController } from "./posts.controller";
import { UserRole } from "../../../../generated/prisma";

const router = express.Router();

router.get(
  "/get-approved-post",
  // auth(UserRole.ADMIN, UserRole.USER),
  PostController.getApprovedPostFromDB
);
router.get(
  "/get-pending-post",
  auth(UserRole.ADMIN),
  PostController.getPendingPostFromDB
);
router.get(
  "/get-rejected-post",
  auth(UserRole.ADMIN),
  PostController.getRejectedPostFromDB
);
router.get(
  "/get-premium-post",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.getPremiumPostFromDB
);
router.get("/", auth(UserRole.ADMIN), PostController.getAllFromDB);
router.get("/:id", auth(UserRole.ADMIN), PostController.getPostById);

router.get("/get-approved-post/:id", PostController.getApprovedPostById);

router.post(
  "/create-post",
  auth(UserRole.USER),
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return PostController.createPost(req, res, next);
  }
);

router.patch(
  "/update-status/:id",
  auth(UserRole.ADMIN),
  PostController.updatePostStatus
);


router.patch(
  "/update-post/:id",
  auth(UserRole.USER),
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return PostController.updatePost(req, res, next);
  }
);

router.delete("/:id", auth(UserRole.ADMIN), PostController.deletePost);

router.patch(
  "/premium/:id",
  auth(UserRole.ADMIN),
  PostController.makePostPremium
);

router.patch(
  "/regular/:id",
  auth(UserRole.ADMIN),
  PostController.makePostRegular
);

export const PostRoutes = router;
