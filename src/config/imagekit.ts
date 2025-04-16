
import ImageKit from "imagekit";
import { FileDto } from "../types/fileDto";
import { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT } from "./config";

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});



export const uploadImage = async (file: Express.Multer.File):Promise<FileDto> => {
    try {
        const result = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: file.originalname, 
        folder: "your-folder-name", 
        });
        return {
        url: result.url,
        fileId: result.fileId,
        };
    } catch (error) {
        throw new Error("Image upload failed");
    }
    };
