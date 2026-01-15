import mongoose from 'mongoose';
import { AppError } from '../../utils/appError';
import StockMovementModel from './model/stockMovement.model';

const getAvailableStock = async (
    businessId: string,
    variantId: string,
    session?: mongoose.ClientSession
) => {
    const result = await StockMovementModel.aggregate(
        [
            {
                $match: {
                    businessId: new mongoose.Types.ObjectId(businessId),
                    productVariantId: new mongoose.Types.ObjectId(variantId),
                },
            },
            {
                $group: {
                    _id: null,
                    stock: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', 'IN'] },
                                '$quantity',
                                {
                                    $cond: [
                                        { $eq: ['$type', 'OUT'] },
                                        { $multiply: ['$quantity', -1] },
                                        '$quantity',
                                    ],
                                },
                            ],
                        },
                    },
                },
            },
        ],
        { session }
    );

    return result[0]?.stock || 0;
};


const deductStock = async ({
    businessId,
    variantId,
    quantity,
    referenceType,
    referenceId,
}: {
    businessId: string;
    variantId: string;
    quantity: number;
    referenceType: 'SALES_ORDER' | 'RETURN';
    referenceId: string;
}) => {
    if (quantity <= 0) {
        throw new AppError('Quantity must be greater than zero', 400);
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const availableStock = await getAvailableStock(
            businessId,
            variantId,
            session
        );

        if (availableStock < quantity) {
            throw new AppError('Insufficient stock', 400);
        }

        await StockMovementModel.create(
            [
                {
                    businessId,
                    productVariantId: variantId,
                    type: 'OUT',
                    quantity,
                    referenceType,
                    referenceId,
                },
            ],
            { session }
        );

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


const addStock = async ({
    businessId,
    variantId,
    quantity,
    referenceType,
    referenceId,
}: {
    businessId: string;
    variantId: string;
    quantity: number;
    referenceType: 'PURCHASE_ORDER' | 'RETURN';
    referenceId: string;
}) => {
    if (quantity <= 0) {
        throw new AppError('Quantity must be greater than zero', 400);
    }

    await StockMovementModel.create({
        businessId,
        productVariantId: variantId,
        type: 'IN',
        quantity,
        referenceType,
        referenceId,
    });
};

const adjustStock = async ({
    businessId,
    variantId,
    quantity,
    note,
}: {
    businessId: string;
    variantId: string;
    quantity: number;
    note?: string;
}) => {
    if (!quantity) {
        throw new AppError('Adjustment quantity is required', 400);
    }

    await StockMovementModel.create({
        businessId,
        productVariantId: variantId,
        type: 'ADJUSTMENT',
        quantity,
        referenceType: 'MANUAL',
        note,
    });
};

export default {
    getAvailableStock,
    deductStock,
    addStock,
    adjustStock
};
