import { AppError } from '../../utils/appError';
import ProductModel from './model/product.model';
import ProductVariantionModel from './model/variation.model'

const createProduct = async (currentUser: any, data: any) => {
    if (currentUser.role === 'STAFF') {
        throw new AppError('Access denied', 403);
    }

    if (!data.name) {
        throw new AppError('Product name is required', 400);
    }
    const product = await ProductModel.create({
        businessId: currentUser.businessId,
        name: data.name,
        description: data.description,
        categories: data.categories || [],
        images: data.images || [],
        status: 'ACTIVE',
    });

    let variants: any = [];

    if (Array.isArray(data.variants) && data.variants.length > 0) {
        variants = await ProductVariantionModel.insertMany(
            data.variants.map((variant: any) => {
                if (!variant.sku || !variant.mrp) {
                    throw new AppError('Variant sku and mrp are required', 400);
                }

                if (variant.sellPrice &&
                    variant.sellPrice > variant.mrp) {
                    throw new AppError('Sell price cannot be greater than MRP', 400);
                }

                return {
                    businessId: currentUser.businessId,
                    productId: product._id,
                    sku: variant.sku,
                    attributes: variant.attributes || {},
                    mrp: variant.mrp,
                    sellPrice: variant.sellPrice,
                    lowStockThreshold:
                        variant.lowStockThreshold || 5,
                    status: 'ACTIVE',
                };
            })
        );
    }

    return {
        product,
        variants,
    };
};


const getProducts = async (currentUser: any, query: any) => {
    if (currentUser.role === 'STAFF') {
        throw new AppError('Access denied', 403);
    }

    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(parseInt(query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const filter: any = {
        businessId: currentUser.businessId,
    };

    if (query.status) {
        filter.status = query.status;
    }

    if (query.category) {
        filter.categories = query.category;
    }

    if (query.search) {
        filter.name = { $regex: query.search, $options: 'i' };
    }

    const sortBy = ['createdAt', 'name'].includes(query.sortBy)
        ? query.sortBy
        : 'createdAt';

    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

    const [products, total] = await Promise.all([
        ProductModel.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit),
        ProductModel.countDocuments(filter),
    ]);

    const productIds = products.map((p) => p._id);

    const variants = await ProductVariantionModel.find({
        businessId: currentUser.businessId,
        productId: { $in: productIds },
    });

    const variantMap: Record<string, any[]> = {};
    variants.forEach((variant) => {
        const key = variant.productId.toString();
        if (!variantMap[key]) {
            variantMap[key] = [];
        }
        variantMap[key].push(variant);
    });

    const items = products.map((product) => ({
        ...product.toObject(),
        variants: variantMap[product._id.toString()] || [],
    }));

    return {
        Products: items,
        Total: total
    };
};


const getProductById = async (currentUser: any, productId: string) => {
    if (currentUser.role === 'STAFF') {
        throw new AppError('Access denied', 403);
    }

    const product = await ProductModel.findOne({
        _id: productId,
        businessId: currentUser.businessId,
    });

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    const variants = await ProductVariantionModel.find({
        businessId: currentUser.businessId,
        productId,
    });

    return {
        ...product.toObject(),
        variants,
    };
};


const updateProduct = async (
    currentUser: any,
    productId: string,
    data: any
) => {
    if (currentUser.role === 'STAFF') {
        throw new AppError('Access denied', 403);
    }

    const product = await ProductModel.findOne({
        _id: productId,
        businessId: currentUser.businessId,
    });

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    const productFields = [
        'name',
        'description',
        'categories',
        'images',
    ];

    productFields.forEach((field) => {
        if (data[field] !== undefined) {
            (product as any)[field] = data[field];
        }
    });

    await product.save();

    if (Array.isArray(data.variants)) {
        for (const variant of data.variants) {
            if (variant._id) {
                await ProductVariantionModel.updateOne(
                    {
                        _id: variant._id,
                        businessId: currentUser.businessId,
                        productId,
                    },
                    {
                        $set: {
                            sku: variant.sku,
                            attributes: variant.attributes || {},
                            mrp: variant.mrp,
                            sellPrice: variant.sellPrice,
                            lowStockThreshold:
                                variant.lowStockThreshold,
                        },
                    }
                );
            } else {
                await ProductVariantionModel.create({
                    businessId: currentUser.businessId,
                    productId,
                    sku: variant.sku,
                    attributes: variant.attributes || {},
                    mrp: variant.mrp,
                    sellPrice: variant.sellPrice,
                    lowStockThreshold:
                        variant.lowStockThreshold || 5,
                    status: 'ACTIVE',
                });
            }
        }
    }

    const variants = await ProductVariantionModel.find({
        businessId: currentUser.businessId,
        productId,
    });

    return {
        ...product.toObject(),
        variants,
    };
};

const updateProductStatus = async (
    currentUser: any,
    productId: string,
    status: string
) => {
    if (currentUser.role !== 'OWNER') {
        throw new AppError(
            'Only owner can update product status',
            403
        );
    }

    if (!['ACTIVE', 'INACTIVE', 'DRAFT'].includes(status)) {
        throw new AppError('Invalid status', 400);
    }

    const product = await ProductModel.findOneAndUpdate(
        {
            _id: productId,
            businessId: currentUser.businessId,
        },
        { status },
        { new: true }
    );

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    return product;
};


const deleteProduct = async (
    currentUser: any,
    productId: string
) => {
    if (currentUser.role !== 'OWNER') {
        throw new AppError(
            'Only owner can delete products',
            403
        );
    }

    const product = await ProductModel.findOne({
        _id: productId,
        businessId: currentUser.businessId,
    });

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    await ProductVariantionModel.deleteMany({
        businessId: currentUser.businessId,
        productId,
    });

    await product.deleteOne();
};



export default {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    updateProductStatus,
    deleteProduct
};
