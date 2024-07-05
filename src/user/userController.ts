import { Request, NextFunction, Response } from 'express';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import userModel from './userModel';
import { sign } from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from './userTypes';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    //validaion
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const error = createHttpError(400, 'All fields are required');

        return next(error);
    }
    //alredy exist or not
    //database call

    try {
        const user = await userModel.findOne({ email: email });

        if (user) {
            const error = createHttpError(
                400,
                'User already exists with this email.',
            );
            return next(error);
        }
    } catch (error) {
        return next(createHttpError(500, 'Error while getting user '));
    }

    //password ->hash+salt=new hash every time
    //salt ->random string
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser: User;

    try {
        newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });
    }
    catch (error) {
        return next(createHttpError(500, 'Error while creating user '));
    }

    try {
        //Token generation jwt
        const token = sign({ sub: (await newUser)._id }, config.jwtSecret as string, { expiresIn: '7d' },);

        //response
        res.status(201).json({ accssesToken: token });
    } catch (error) {
        return next(createHttpError(500, 'Error while signing the jwt'));
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(createHttpError(400, 'All fields are required'));
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return next(createHttpError(404, 'User not found'));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next(createHttpError(400, 'Username or password incorrect'));
    }

    const token = sign({ sub: user._id }, config.jwtSecret as string, {
        expiresIn: '7d',
    });

    res.json({ accessToken: token });
};

export { createUser, loginUser };
