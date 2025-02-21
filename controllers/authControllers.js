import jwt from 'jsonwebtoken';
import { comparePasswords, hashPassword } from '../utils/pwdUtils.js';

import User from '../models/User.js';
import { createError } from '../utils/error.js';
import { sendEmail } from '../utils/mail.js';

export const registerUser = async (req, res, next) => {
    try {
        const hashedPassword = await hashPassword(req.body.password);

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).send("User has been created");
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) return next(createError(404, "User not found!"));

        const isPasswordCorrect = await comparePasswords(req.body.password, user.password);

        if (!isPasswordCorrect) return next(createError(400, "Incorrect email or password!"));

        const token = jwt.sign({ id: user._id, role: user.role, }, process.env.JWT)

        const { password, role, ...otherDetails } = user._doc;

        res.cookie("access_token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Strict'
        }).status(200).json({ ...otherDetails, token });
    } catch (err) {
        next(err);
    }
}

export const requestPasswordReset = async (req, res, next) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "1h" });
        // console.log(token);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${token}`;
        const message = `You are receiving this email because you (or someone else) have requested the reset of the password. Please click on the following link, or paste this into your browser to complete the process: ${resetUrl}`;

        await sendEmail({
            to: user.email,
            subject: "Password Reset",
            text: message,
        });

        res.status(200).json({ message: "Password reset email sent." });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const password = req.body.password;

    try {
        const decoded = jwt.verify(token, process.env.JWT);

        const user = await User.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password set successfully!" });
    } catch (error) {
        next(error);
    }
}

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
}

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
        }
        next();
    }
}