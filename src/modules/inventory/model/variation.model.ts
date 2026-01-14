import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema(
    {
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
            index: true,
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            index: true,
        },

        sku: {
            type: String,
            required: true,
            trim: true,
        },

        attributes: {
            type: Map,
            of: String,
            default: {},
        },

        mrp: {
            type: Number,
            required: true,
            min: 0,
        },

        sellPrice: {
            type: Number,
            min: 0,
        },

        costPrice: {
            type: Number,
            min: 0,
        },

        lowStockThreshold: {
            type: Number,
            default: 2,
        },

        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE'],
            default: 'ACTIVE',
        },
    },
    {
        timestamps: true,
    }
);

productVariantSchema.index(
    { businessId: 1, sku: 1 },
    { unique: true }
);

export default mongoose.model('ProductVariant', productVariantSchema);
