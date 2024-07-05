
import express from "express";
import { createBook } from "./bookControllers";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authentication";


const bookRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    limits: { fileSize: 3e7 } //30mb
})


//routes
//multer is inbuilt middleware which is used to handle mutipart form data
//first it will save files in local storage after that we we upload it in cloudinary


bookRouter.post("/createbook", authenticate, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), createBook);

// userRouter.post("/login",loginUser);

export default bookRouter;