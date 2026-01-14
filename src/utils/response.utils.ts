import { Response } from 'express';

interface ApiResponseOptions {
    success: boolean;
    message: string;
    statusCode: number;
    data?: any;
}

export const sendResponse = (
    res: Response,
    options: ApiResponseOptions
) => {
    const { success, message, statusCode, data = null } = options;

    return res.status(statusCode).json({
        success,
        message,
        statusCode,
        data,
    });
};
