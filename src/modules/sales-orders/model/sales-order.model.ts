import mongoose from 'mongoose';

const salesOrderItemSchema = new mongoose.Schema({
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
        required: true,
    },

    qty: {
        type: Number,
        required: true,
        min: 1,
    },

    sellPrice: {
        type: Number,
        required: true,
        min: 0,
    },
});

const salesOrderSchema = new mongoose.Schema(
    {
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ['PLACED', 'CONFIRMED', 'CANCELLED'],
            default: 'PLACED',
            index: true,
        },

        items: [salesOrderItemSchema],

        customerName: {
            type: String,
            trim: true,
        },

        customerPhone: {
            type: String,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },

        confirmedAt: {
            type: Date,
        },

        cancelledAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

salesOrderSchema.index({ businessId: 1, createdAt: -1 });
salesOrderSchema.index({ businessId: 1, status: 1, createdAt: -1 });

export default mongoose.model('SalesOrder', salesOrderSchema);
