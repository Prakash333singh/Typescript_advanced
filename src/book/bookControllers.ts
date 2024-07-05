import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path"
import bookModel from "./bookModel";
import fs from "fs"
import { AuthRequest } from "../middlewares/authentication";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    //validaion

    const { title, genre } = req.body;

    console.log("files", req.files);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImageMineType = files.coverImage[0].mimetype.split("/").at(-1);

    const fileName = files.coverImage[0].filename;

    const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName)

    const uploadResult = await cloudinary.uploader.upload(filePath, {

        filename_override: fileName,
        folder: "book-covers",
        format: coverImageMineType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilepPath = path.resolve(
        __dirname, "../../public/data/uploads", bookFileName

    )

    const bookFileUploadResult = await cloudinary.uploader.upload(bookFilepPath, {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
    })

    // console.log("bookfileUploadResult", bookFileUploadResult)

    // console.log("uploadResult", uploadResult)

    const _req = req as AuthRequest

    const newBook = await bookModel.create({
        title,
        genre,
        auhtor: _req.userId,
        coverImage: uploadResult.secure_url,
        file: bookFileUploadResult.secure_url,
    })

    ///delete tem files

    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilepPath);

    res.status(200).json({ id: newBook._id })

};

export { createBook };
