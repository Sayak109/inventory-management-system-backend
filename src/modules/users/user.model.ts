import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true,
        },

        firstName: {
            type: String,
            trim: true,
        },

        lastName: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        phone: {
            type: String,
            trim: true,
        },
        profile: {
            type: String,
            trim: true,
        },

        role: {
            type: String,
            enum: ['OWNER', 'MANAGER', 'STAFF'],
            default: 'STAFF',
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });
userSchema.index({ tenantId: 1, isActive: 1 });

const User = mongoose.model('User', userSchema);

export default User;
