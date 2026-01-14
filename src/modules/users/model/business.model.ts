import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        logo: {
            type: String,
            trim: true,
        },

        gstNumber: {
            type: String,
            trim: true,
        },

        panNumber: {
            type: String,
            trim: true,
        },

        address: {
            line1: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            country: { type: String, trim: true, default: 'India' },
            pincode: { type: String, trim: true },
        },

        bankDetails: {
            accountHolderName: {
                type: String,
                trim: true
            },
            accountNumber: {
                type: String,
                trim: true
            },
            bankName: {
                type: String,
                trim: true
            },
            ifscCode: {
                type: String,
                trim: true
            },
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        verificationStatus: {
            type: String,
            enum: ['PENDING', 'VERIFIED', 'REJECTED'],
            default: 'VERIFIED',
        },
    },
    {
        timestamps: true,
    }
);

const Business = mongoose.model('Business', businessSchema);

export default Business;
