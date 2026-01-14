import { Request, Response } from 'express';
import { sendResponse } from '../../utils/response.utils';
import salesOrderService from './sales-order.service';

const createOrder = async (req: Request, res: Response) => {
    const order = await salesOrderService.createSalesOrder(
        req.user,
        req.body
    );

    sendResponse(res, {
        success: true,
        message: 'Sales order created',
        statusCode: 201,
        data: order,
    });
};

const confirmOrder = async (req: Request, res: Response) => {
    const order = await salesOrderService.confirmSalesOrder(
        req.user,
        req.params.id as string
    );

    sendResponse(res, {
        success: true,
        message: 'Sales order confirmed',
        statusCode: 200,
        data: order,
    });
};

const cancelOrder = async (req: Request, res: Response) => {
    const order = await salesOrderService.cancelSalesOrder(
        req.user,
        req.params.id as string
    );

    sendResponse(res, {
        success: true,
        message: 'Sales order cancelled',
        statusCode: 200,
        data: order,
    });
};

const getOrders = async (req: Request, res: Response) => {
    const result = await salesOrderService.getSalesOrders(
        req.user,
        req.query
    );

    sendResponse(res, {
        success: true,
        message: 'Sales orders fetched',
        statusCode: 200,
        data: result,
    });
};

const getOrderById = async (req: Request, res: Response) => {
    const order = await salesOrderService.getSalesOrderById(
        req.user,
        req.params.id as string
    );

    sendResponse(res, {
        success: true,
        message: 'Sales order details fetched',
        statusCode: 200,
        data: order,
    });
};


export default {
    createOrder,
    confirmOrder,
    cancelOrder,
    getOrders,
    getOrderById
}