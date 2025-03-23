import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadProfilePicture = async (req, res, next) => {
    try {
        const filePath = req.file.path;
        // console.log("file path: ", filePath);
        const result = await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath);

        // console.log("Upload results backend: ", result.data);

        const userId = req.body.userId;
        const user = await User.findByIdAndUpdate(userId, {
            profilePicture: result.secure_url,
        }, { new: true });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};