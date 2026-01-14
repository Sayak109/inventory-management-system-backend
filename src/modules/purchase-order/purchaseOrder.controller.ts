import { Request, Response } from 'express';
import poService from './purchaseOrder.service';
import { sendResponse } from '../../utils/response.utils';

const createPO = async (req: Request, res: Response) => {
    const po = await poService.createPurchaseOrder(
        req.user,
        req.body
    );

    sendResponse(res, {
        success: true,
        message: 'Purchase order created',
        statusCode: 201,
        data: po,
    });
};

const updatePOStatus = async (req: Request, res: Response) => {
    const { poId, status } = req.body;
    const po = await poService.updatePurchaseOrderStatus(
        req.user,
        poId,
        status
    );

    sendResponse(res, {
        success: true,
        message: 'Updated Purchase order status sucessfully',
        statusCode: 200,
        data: po,
    });
};
const receivePO = async (req: Request, res: Response) => {
    const { poId, receivedItems } = req.body;

    const po = await poService.receivePurchaseOrder(
        req.user,
        poId,
        receivedItems
    );

    sendResponse(res, {
        success: true,
        message: 'Received order created',
        statusCode: 200,
        data: po,
    });
};

export default {
    createPO,
    updatePOStatus,
    receivePO
}