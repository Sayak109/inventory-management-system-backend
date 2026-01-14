import { Request, Response } from 'express';
import userService from './user.service';
import { sendResponse } from '../../utils/response.utils';

const createUser = async (req: Request, res: Response) => {
    const user = await userService.createUser(req.user!, req.body);

    sendResponse(res, {
        success: true,
        message: 'User created successfully',
        statusCode: 201,
        data: user,
    });
};


const getUsers = async (req: Request, res: Response) => {
    const users = await userService.getUsers(
        req.user!,
        req.query
    );

    sendResponse(res, {
        success: true,
        message: 'Users fetched successfully',
        statusCode: 200,
        data: users,
    });
};



const getUserById = async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.user!, req.params.id as string);

    sendResponse(res, {
        success: true,
        message: 'User fetched successfully',
        statusCode: 200,
        data: user,
    });
};

const updateUser = async (req: Request, res: Response) => {
    const user = await userService.updateUser(
        req.user!,
        req.params.id as string,
        req.body
    );

    sendResponse(res, {
        success: true,
        message: 'Users updated successfully',
        statusCode: 200,
        data: user,
    });
};

const deleteUser = async (req: Request, res: Response) => {
    await userService.deleteUser(req.user!, req.params.id as string);

    sendResponse(res, {
        success: true,
        message: 'Users deleted successfully',
        statusCode: 200,
        data: null,
    });
};

export default {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
