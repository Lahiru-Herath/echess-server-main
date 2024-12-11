import jwt from 'jsonwebtoken';
import { comparePasswords, hashPassword } from '../utils/pwdUtils.js';

import User from '../models/User.js';
import { createError } from '../utils/error.js';

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

        if (!isPasswordCorrect) return next(createError(400, "Incorrect email of password!"));

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