import PurchaseOrder from './model/purchaseOrder.model';
import { AppError } from '../../utils/appError';
import stockService from "../inventory/stock.service"


const createPurchaseOrder = async (
    currentUser: any,
    data: any
) => {
    if (currentUser.role === 'STAFF') {
        throw new AppError('Access denied', 403);
    }

    if (!data.supplierId || !Array.isArray(data.items)) {
        throw new AppError('Invalid purchase order data', 400);
    }

    return PurchaseOrder.create({
        businessId: currentUser.businessId,
        supplierId: data.supplierId,
        items: data.items,
        notes: data.notes,
    });
};


const updatePurchaseOrderStatus = async (
    currentUser: any,
    poId: string,
    status: string
) => {
    if (!['SENT', 'CONFIRMED', 'RECEIVED'].includes(status)) {
        throw new AppError('Invalid status transition', 400);
    }

    const po = await PurchaseOrder.findOne({
        _id: poId,
        businessId: currentUser.businessId,
    });

    if (!po) {
        throw new AppError('Purchase order not found', 404);
    }

    // If status is RECEIVED, automatically receive all items
    if (status === 'RECEIVED') {
        if (po.status === 'RECEIVED') {
            throw new AppError('Purchase order already received', 400);
        }

        // Receive all items that haven't been fully received
        for (const item of po.items) {
            const remainingQty = item.orderedQty - item.receivedQty;
            
            if (remainingQty > 0) {
                // Add stock for the remaining quantity
                await stockService.addStock({
                    businessId: currentUser.businessId.toString(),
                    variantId: item.variantId.toString(),
                    quantity: remainingQty,
                    referenceType: 'PURCHASE_ORDER',
                    referenceId: po._id.toString(),
                });

                // Update received quantity
                item.receivedQty = item.orderedQty;
            }
        }

        po.status = 'RECEIVED';
        await po.save();
        return po;
    }

    // For SENT and CONFIRMED, just update status
    po.status = status;
    await po.save();
    return po;
};


const receivePurchaseOrder = async (
    currentUser: any,
    poId: string,
    receivedItems: any[]
) => {
    const po = await PurchaseOrder.findOne({
        _id: poId,
        businessId: currentUser.businessId,
    });

    if (!po) {
        throw new AppError('Purchase order not found', 404);
    }

    if (po.status === 'RECEIVED') {
        throw new AppError('Purchase order already received', 400);
    }

    for (const receivedItem of receivedItems) {
        const item = po.items.find(
            (i: any) =>
                i.variantId.toString() ===
                receivedItem.variantId
        );

        if (!item) continue;

        const remainingQty =
            item.orderedQty - item.receivedQty;

        if (receivedItem.qty > remainingQty) {
            throw new AppError('Received quantity exceeds ordered quantity', 400);
        }

        await stockService.addStock({
            businessId: currentUser.businessId.toString(),
            variantId: item.variantId.toString(),
            quantity: receivedItem.qty,
            referenceType: 'PURCHASE_ORDER',
            referenceId: po._id.toString(),
        });

        item.receivedQty += receivedItem.qty;
    }

    const allReceived = po.items.every(
        (i: any) => i.receivedQty === i.orderedQty
    );

    if (allReceived) {
        po.status = 'RECEIVED';
    }

    await po.save();
    return po;
};


const getPurchaseOrders = async (
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
        PurchaseOrder.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        PurchaseOrder.countDocuments(filter),
    ]);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
        },
    };
};

const getPurchaseOrderById = async (
    currentUser: any,
    poId: string
) => {
    const po = await PurchaseOrder.findOne({
        _id: poId,
        businessId: currentUser.businessId,
    });

    if (!po) {
        throw new AppError('Purchase order not found', 404);
    }

    return po;
};



export default {
    createPurchaseOrder,
    updatePurchaseOrderStatus,
    receivePurchaseOrder,
    getPurchaseOrders,
    getPurchaseOrderById
}