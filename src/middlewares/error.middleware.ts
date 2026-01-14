import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { sendResponse } from '../utils/response.utils';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return sendResponse(res, {
            success: false,
            message: err.message,
            statusCode: err.statusCode,
            data: null,
        });
    }
    return sendResponse(res, {
        success: false,
        message: 'Internal server error',
        statusCode: 500,
        data: null,
    });
};
