import bcrypt from 'bcryptjs';
import UserModel from '../users/model/user.model';
import BusinessModel from '../users/model/business.model';
import { AppError } from '../../utils/appError';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
const PHONE_REGEX = /^\d{10}$/;

const register = async (data: any) => {
    const {
        businessName,
        logo,
        gstNumber,
        panNumber,
        address,
        bankDetails,

        email,
        password,
        firstName,
        lastName,
        phone,
        profile,
    } = data;

    if (!businessName || !email || !password) {
        throw new AppError('Required fields are missing', 400);
    }
    if (!PASSWORD_REGEX.test(password)) {
        throw new AppError(
            'Password must include at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
            400
        );
    }
    if (phone && !PHONE_REGEX.test(phone)) {
        throw new AppError('Phone number must be a valid 10-digit number', 400);
    }

    //Check if user already exists
    const existingUser = await UserModel.findOne({
        email: email.toLowerCase(),
    });

    if (existingUser) {
        throw new AppError('User already exists', 409);
    }

    //Create Business
    const business = await BusinessModel.create({
        name: businessName,
        logo,
        gstNumber,
        panNumber,
        address,
        bankDetails,
        verificationStatus: 'VERIFIED',
    });
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create OWNER
    const user = await UserModel.create({
        businessId: business._id,
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        profile,
        role: 'OWNER',
        isActive: true,
    });

    return user;
};

const login = async (data: any) => {
    const { email, password } = data;
    if (!email || !password) {
        throw new AppError('Email and password are required', 400);
    }

    //Find user
    const user = await UserModel.findOne({
        email: email.toLowerCase().trim(),
    }).select('+password');

    if (!user || !user.isActive) {
        throw new AppError('Invalid credentials', 401);
    }

    const business = await BusinessModel.findById(user.businessId);
    if (!business || !business.isActive) {
        throw new AppError('Business is inactive', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
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
