import mongoose from 'mongoose';

const purchaseOrderItemSchema = new mongoose.Schema({
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
        required: true,
    },

    orderedQty: {
        type: Number,
        required: true,
        min: 1,
    },

    receivedQty: {
        type: Number,
        default: 0,
        min: 0,
    },

    costPrice: {
        type: Number,
        required: true,
        min: 0,
    },
});

const purchaseOrderSchema = new mongoose.Schema(
    {
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
            index: true,
        },

        supplierId: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ['DRAFT', 'SENT', 'CONFIRMED', 'RECEIVED'],
            default: 'DRAFT',
        },

        items: [purchaseOrderItemSchema],

        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
