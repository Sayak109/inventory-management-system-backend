import { Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import authService from './auth.service';
import { sendResponse } from '../../utils/response.utils';

const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';
const COOKIE_SAME_SITE = (process.env.COOKIE_SAME_SITE ||
    'lax') as 'lax' | 'strict' | 'none';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;
const COOKIE_EXPIRATION_TIME = Number(
    process.env.COOKIE_EXPIRATION_TIME || 3600
);
const JWT_SECRET: Secret = process.env.JWT_SECRET as string;

const signOptions: SignOptions = {
    expiresIn: process.env.TOKEN_EXPIRATION_TIME as SignOptions['expiresIn'],
};


const setAuthCookie = (res: Response, token: string) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAME_SITE,
        domain: COOKIE_DOMAIN,
        maxAge: COOKIE_EXPIRATION_TIME * 1000,
    });
};

const register = async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    const token = jwt.sign(
        {
            userId: user._id,
            businessId: user.businessId,
            role: user.role,
        },
        JWT_SECRET,
        signOptions
    );
    setAuthCookie(res, token);
    sendResponse(res, {
        success: true,
        message: 'Registration successful',
        statusCode: 201,
        data: user,
    });
};

const login = async (req: Request, res: Response) => {
    const user = await authService.login(req.body);

    const token = jwt.sign(
        {
            userId: user._id,
            businessId: user.businessId,
            role: user.role,
        },
        JWT_SECRET,
        signOptions
    );

    setAuthCookie(res, token);
    sendResponse(res, {
        success: true,
        message: 'Login successful',
        statusCode: 200,
        data: user,
    });
};

const logout = async (_req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAME_SITE,
        domain: COOKIE_DOMAIN,
    });

    sendResponse(res, {
        success: true,
        message: 'Logged out',
        statusCode: 200,
        data: null,
    });
};

const getMe = async (req: Request, res: Response) => {
    const user = await authService.getUserById(req.user?.userId);

    sendResponse(res, {
        success: true,
        message: 'Me',
        statusCode: 200,
        data: user,
    });
};

export default {
    register,
    login,
    logout,
    getMe,
};
