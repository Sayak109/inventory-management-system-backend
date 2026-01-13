import bcrypt from 'bcryptjs';
import UserModel from '../users/user.model';
import TenantModel from '../users/tenants.model';

// simple, readable regexes
const STRONG_PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

const PHONE_REGEX = /^\d{10}$/;

const register = async (data: any) => {
    const {
        email,
        password,
        firstName,
        lastName,
        phone,
        profile,
        tenantId,
        role,
    } = data;

    if (!email || !password || !tenantId) {
        throw new Error('Required fields are missing');
    }

    if (!STRONG_PASSWORD_REGEX.test(password)) {
        throw new Error(
            'Password must include at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
        );
    }

    if (phone && !PHONE_REGEX.test(phone)) {
        throw new Error('Phone number must be a valid 10-digit number');
    }

    const tenant = await TenantModel.findById(tenantId);
    if (!tenant || !tenant.isActive) {
        throw new Error('Tenant is not active');
    }

    const existingUser = await UserModel.findOne({
        email: email.toLowerCase(),
        tenantId,
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
        tenantId,
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        profile,
        role: role || 'STAFF',
    });

    return user;
};

const login = async (data: any) => {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await UserModel.findOne({
        email: email.toLowerCase(),
    }).select('+password');

    if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
    }

    const tenant = await TenantModel.findById(user.tenantId);
    if (!tenant || !tenant.isActive) {
        throw new Error('Tenant is inactive');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    return user;
};

const getUserById = async (userId?: string) => {
    if (!userId) return null;

    const user = await UserModel.findById(userId);
    if (!user || !user.isActive) {
        return null;
    }

    return user;
};

export default {
    register,
    login,
    getUserById,
};
