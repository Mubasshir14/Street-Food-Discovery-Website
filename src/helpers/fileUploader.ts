import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  cloudinary.config({
    cloud_name: "dkwn9bool",
    api_key: "321321414891178",
    api_secret: "Gp6xg9-eOc0ylgOInGZ0CLnAfyY",
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file?.path,
      //   {
      //     public_id: file?.originalname,
      //   },
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file?.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const FileUploader = {
  upload,
  uploadToCloudinary,
};
