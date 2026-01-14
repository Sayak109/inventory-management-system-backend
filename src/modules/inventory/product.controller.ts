import { Request, Response } from 'express';
import { sendResponse } from '../../utils/response.utils';
import productService from './product.service';

const createProduct = async (req: Request, res: Response) => {
    const product = await productService.createProduct(req.user!, req.body);
    sendResponse(res, {
        success: true,
        message: 'Product created successfully',
        statusCode: 201,
        data: product,
    });
};

const getProducts = async (req: Request, res: Response) => {
    const result = await productService.getProducts(req.user!, req.query);
    sendResponse(res, {
        success: true,
        message: 'Products fetched successfully',
        statusCode: 200,
        data: result,
    });
};

const getProductById = async (req: Request, res: Response) => {
    const product = await productService.getProductById(
        req.user!,
        req.params.id as string
    );
    sendResponse(res, {
        success: true,
        message: 'Product fetched successfully',
        statusCode: 200,
        data: product,
    });
};

const updateProduct = async (req: Request, res: Response) => {
    const product = await productService.updateProduct(
        req.user!,
        req.params.id as string,
        req.body
    );
    sendResponse(res, {
        success: true,
        message: 'Product updated successfully',
        statusCode: 200,
        data: product,
    });
};

const updateProductStatus = async (req: Request, res: Response) => {
    const product = await productService.updateProductStatus(
        req.user!,
        req.params.id as string,
        req.body.status
    );
    sendResponse(res, {
        success: true,
        message: 'Product status updated',
        statusCode: 200,
        data: product,
    });
};

const deleteProduct = async (req: Request, res: Response) => {
    await productService.deleteProduct(req.user!, req.params.id as string);
    sendResponse(res, {
        success: true,
        message: 'Product deleted successfully',
        statusCode: 200,
        data: null,
    });
};


export default {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    updateProductStatus,
    deleteProduct,
};
