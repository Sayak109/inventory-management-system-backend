import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        domain: {
            type: String,
            trim: true,
            lowercase: true,
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
tenantSchema.index({ domain: 1 }, { unique: true, sparse: true });

const Tenant = mongoose.model('Tenant', tenantSchema);

export default Tenant;
