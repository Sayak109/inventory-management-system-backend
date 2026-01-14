import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        categories: {
            type: [String],
            default: [],
            index: true,
        },

        images: {
            type: [String],
            default: [],
        },

        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE', 'DRAFT'],
            default: 'ACTIVE',
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.index({ businessId: 1, name: 1 });

export default mongoose.model('Product', productSchema);
