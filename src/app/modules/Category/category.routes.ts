import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { CategoryController } from "./category.controller";
import { UserRole } from "../../../../generated/prisma";
import { FileUploader } from "../../../helpers/fileUploader";

const router = express.Router();

router.get("/", CategoryController.getAllFromDB);
router.get(
  "/get-dashboard-overview",
  CategoryController.getAdminDashboardStats
);
router.get("/get-payment-overview", CategoryController.getPaymentByMonth);

router.post(
  "/create-category",
  auth(UserRole.ADMIN),
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return CategoryController.createCategory(req, res, next);
  }
);
router.get("/:id", CategoryController.getAllFromDBByID);

router.delete("/:id", auth(UserRole.ADMIN), CategoryController.deleteCategory);

export const CategoryRoutes = router;
