import mongoose from 'mongoose';
import SalesOrderModel from './model/sales-order.model';
import stockService from '../inventory/stock.service';
import { AppError } from '../../utils/appError';

const createSalesOrder = async (
    currentUser: any,
    data: any
) => {
    if (!Array.isArray(data.items) || !data.items.length) {
        throw new AppError('Invalid sales order data', 400);
    }

    return SalesOrderModel.create({
        businessId: currentUser.businessId,
        customerName: data.customerName,
        items: data.items,
        notes: data.notes,
        status: 'PLACED',
    });
};

const confirmSalesOrder = async (
    currentUser: any,
    orderId: string
) => {
    const order = await SalesOrderModel.findOne({
        _id: orderId,
        businessId: currentUser.businessId,
    });

    if (!order) {
        throw new AppError('Sales order not found', 404);
    }

    if (order.status !== 'PLACED') {
        throw new AppError('Order cannot be confirmed', 400);
    }

    for (const item of order.items) {
        await stockService.deductStock({
            businessId: currentUser.businessId,
            variantId: item.variantId.toString(),
            quantity: item.qty,
            referenceType: 'SALES_ORDER',
            referenceId: order._id.toString(),
        });
    }

    order.status = 'CONFIRMED';
    order.confirmedAt = new Date();
    await order.save();

    return order;
};

const cancelSalesOrder = async (
    currentUser: any,
    orderId: string
) => {
    const order = await SalesOrderModel.findOne({
        _id: orderId,
        businessId: currentUser.businessId,
    });

    if (!order) {
        throw new AppError('Sales order not found', 404);
    }

    if (order.status === 'CANCELLED') {
        throw new AppError('Order already cancelled', 400);
    }


    if (order.status === 'CONFIRMED') {
        for (const item of order.items) {
            await stockService.addStock({
                businessId: currentUser.businessId,
                variantId: item.variantId.toString(),
                quantity: item.qty,
                referenceType: 'RETURN',
                referenceId: order._id.toString(),
            });
        }
    }

    order.status = 'CANCELLED';
    order.cancelledAt = new Date();
    await order.save();

    return order;
};


const getSalesOrders = async (
    currentUser: any,
    query: any
) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {
        businessId: currentUser.businessId,
    };

    if (query.status) {
        filter.status = query.status;
    }

    const [data, total] = await Promise.all([
        SalesOrderModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        SalesOrderModel.countDocuments(filter),
    ]);

    return {
        SalesOrder: data,
        Total: total,
    };
};

const getSalesOrderById = async (
    currentUser: any,
    orderId: string
) => {
    const order = await SalesOrderModel.findOne({
        _id: orderId,
        businessId: currentUser.businessId,
    });

    if (!order) {
        throw new AppError('Sales order not found', 404);
    }

    return order;
};


export default {
    createSalesOrder,
    confirmSalesOrder,
    cancelSalesOrder,
    getSalesOrders,
    getSalesOrderById
}