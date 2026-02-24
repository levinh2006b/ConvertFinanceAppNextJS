import {v2 as cloudinary} from "cloudinary";
import multer from "multer";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from "../../common/configs/environment.config.js";
import handleAsync from "../../common/utils/handle-async.util.js";
import { throwError } from "../../common/configs/error.config.js";

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const uploadFile = handleAsync(async (req, res) => {
    const file = req.file;

    if (!file) {
        // Now this will work correctly
        throwError(400, "No file uploaded.");
    }

    // Create a unique filename to prevent overwriting
    const fileName = file.originalname.split('.')[0];
    const uniqueFileName = `${fileName}-${Date.now()}`;

    // Convert buffer to a Data URI
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUrl, {
        public_id: uniqueFileName,
        resource_type: "auto",
		transformation: {
            width: 800,         // Target width
            height: 800,        // Target height (same as width for a square)
            crop: "fill",       // Crop mode
            gravity: "auto",    // Automatically focus on the most important part
        },
    });

    res.status(200).json({
        message: "File uploaded successfully.",
        url: result.secure_url,
    });
});


