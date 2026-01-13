import 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                businessId: string;
                role: string;
            };
            businessId?: string;
        }
    }
}

export { };
