import bcrypt from 'bcryptjs';
import UserModel from './model/user.model';
import { AppError } from '../../utils/appError';

const PHONE_REGEX = /^\d{10}$/;
const createUser = async (currentUser: any, data: any) => {
    if (currentUser.role === 'STAFF') {
        throw new AppError('Access denied', 403);
    }
    const {
        email,
        password,
        role,
        firstName,
        lastName,
        phone,
        profile,
    } = data;

    if (!email || !password) {
        throw new AppError('Email and password are required', 400);
    }

    if (role === 'OWNER') {
        throw new AppError('Cannot create OWNER user', 403);
    }

    if (
        currentUser.role === 'MANAGER' &&
        role !== 'STAFF'
    ) {
        throw new AppError('Managers can only create staff users', 403);
    }

    if (phone && !PHONE_REGEX.test(phone)) {
        throw new AppError('Invalid phone number', 400);
    }

    const existingUser = await UserModel.findOne({
        businessId: currentUser.businessId,
        email: email.toLowerCase(),
    });

    if (existingUser) {
        throw new AppError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return UserModel.create({
        businessId: currentUser.businessId,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'STAFF',
        firstName,
        lastName,
        phone,
        profile,
        isActive: true,
    });
};

const getUsers = async (currentUser: any, query: any) => {
    if (currentUser.role === 'STAFF') {
        throw new AppError('Access denied', 403);
    }

    const page = Math.max(parseInt(query.page as string) || 1, 1);
    const limit = Math.min(parseInt(query.limit as string) || 10, 100);
    const skip = (page - 1) * limit;

    const search = query.search?.trim();
    const searchFilter = search
        ? {
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ],
        }
        : {};

    const filter: any = {
        businessId: currentUser.businessId,
        isActive: true,
        ...searchFilter,
    };

    if (currentUser.role === 'MANAGER') {
        filter.role = 'STAFF';
    }

    const sortBy = ['createdAt', 'firstName', 'email'].includes(query.sortBy as string)
        ? (query.sortBy as string)
        : 'createdAt';
    const sortOrder: 1 | -1 = query.sortOrder === 'asc' ? 1 : -1;

    const sort: Record<string, 1 | -1> = {
        [sortBy]: sortOrder,
    };

    const [users, total] = await Promise.all([
        UserModel.find(filter)
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(limit),
        UserModel.countDocuments(filter),
    ]);

    return {
        Users: users,
        Total: total,
    };
};


const getUserById = async (
    currentUser: any,
    userId: string
) => {
    if (currentUser.role === 'STAFF') {
        throw new AppError('Access denied', 403);
    }

    const user = await UserModel.findOne({
        _id: userId,
        businessId: currentUser.businessId,
        isActive: true,
    }).select('-password');

    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (
        currentUser.role === 'MANAGER' &&
        user.role !== 'STAFF'
    ) {
        throw new AppError('Access denied', 403);
    }

    return user;
};

const updateUser = async (
    currentUser: any,
    userId: string,
    data: any
) => {
    if (currentUser.role === 'STAFF') {
        throw new AppError('Access denied', 403);
    }

    const user = await UserModel.findOne({
        _id: userId,
        businessId: currentUser.businessId,
        isActive: true,
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (user.role === 'OWNER') {
        throw new AppError('OWNER cannot be updated', 403);
    }

    if (
        currentUser.role === 'MANAGER' &&
        user.role !== 'STAFF'
    ) {
        throw new AppError('Access denied', 403);
    }

    const allowedUpdates = [
        'firstName',
        'lastName',
        'phone',
        'profile',
    ];

    allowedUpdates.forEach((field) => {
        if (data[field] !== undefined) {
            (user as any)[field] = data[field];
        }
    });

    await user.save();
    return user;
};


const deleteUser = async (
    currentUser: any,
    userId: string
) => {
    if (currentUser.role === 'STAFF') {
        throw new AppError('Access denied', 403);
    }

    const user = await UserModel.findOne({
        _id: userId,
        businessId: currentUser.businessId,
        isActive: true,
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (user.role === 'OWNER') {
        throw new AppError('OWNER cannot be deleted', 403);
    }

    if (
        currentUser.role === 'MANAGER' &&
        user.role !== 'STAFF'
    ) {
        throw new AppError('Access denied', 403);
    }

    user.isActive = false;
    await user.save();
};


export default {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
