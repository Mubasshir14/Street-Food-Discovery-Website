import express, { NextFunction, Request, Response } from "express";
import { FileUploader } from "../../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.get("/", CategoryController.getAllFromDB);
router.get("/:id", CategoryController.getAllFromDBByID);

router.post(
  "/create-category",
  // auth(UserRole.ADMIN, UserRole.USER),
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return CategoryController.createCategory(req, res, next);
  }
);

router.delete("/:id", auth(UserRole.ADMIN), CategoryController.deleteCategory);

export const CategoryRoutes = router;
