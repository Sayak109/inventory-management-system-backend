import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema(
    {
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
            index: true,
        },

        productVariantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductVariant',
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: ['IN', 'OUT', 'ADJUSTMENT'],
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
        },

        referenceType: {
            type: String,
            enum: ['PURCHASE_ORDER', 'SALES_ORDER', 'RETURN', 'MANUAL'],
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
        },

        note: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

stockMovementSchema.index({
    businessId: 1,
    productVariantId: 1,
    createdAt: 1,
});

export default mongoose.model('StockMovement', stockMovementSchema);
