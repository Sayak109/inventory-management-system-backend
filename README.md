# Inventory Management System - Backend

This is the backend API server for the Multi-Tenant Inventory Management System, built with Node.js, Express, TypeScript, and MongoDB.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js 5** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud instance)
- Frontend application running on `http://localhost:3000` (for CORS)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/inventory-management
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
```

3. Run the development server:

```bash
npm run dev
```

4. The server will start on [http://localhost:5001](http://localhost:5001).

## Project Structure

```
inventory-management-system-backend/
├── src/
│   ├── config/                 # Configuration files
│   │   └── database.config.ts  # MongoDB connection
│   ├── middlewares/            # Express middlewares
│   │   ├── auth.middleware.ts  # Authentication middleware
│   │   └── error.middleware.ts # Error handling middleware
│   ├── modules/                # Feature modules
│   │   ├── auth/               # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   ├── users/              # User management module
│   │   │   ├── model/
│   │   │   │   ├── user.model.ts
│   │   │   │   └── business.model.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.service.ts
│   │   ├── inventory/          # Inventory management module
│   │   │   ├── model/
│   │   │   │   ├── product.model.ts
│   │   │   │   ├── variation.model.ts
│   │   │   │   └── stockMovement.model.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.route.ts
│   │   │   ├── product.service.ts
│   │   │   └── stock.service.ts
│   │   ├── purchase-order/     # Purchase order module
│   │   │   ├── model/
│   │   │   │   └── purchaseOrder.model.ts
│   │   │   ├── purchaseOrder.controller.ts
│   │   │   ├── purchaseOrder.routes.ts
│   │   │   └── purchaseOrder.service.ts
│   │   └── sales-orders/       # Sales order module
│   │       ├── model/
│   │       │   └── sales-order.model.ts
│   │       ├── sales-order.controller.ts
│   │       ├── sales-order.routes.ts
│   │       └── sales-order.service.ts
│   ├── types/                  # TypeScript type definitions
│   │   └── express.d.ts        # Express type extensions
│   ├── utils/                  # Utility functions
│   │   ├── appError.ts         # Custom error class
│   │   └── response.utils.ts   # Response helpers
│   └── server.ts               # Express app entry point
├── dist/                       # Compiled JavaScript (after build)
├── package.json
└── tsconfig.json
```

## Features

### Authentication

- User registration with business creation
- User login with JWT token generation
- Protected routes with authentication middleware
- Role-based access control (OWNER, MANAGER, STAFF)
- Cookie-based token storage

### User Management

- Create users with role assignment
- List all users (OWNER/MANAGER only)
- Update user information (OWNER/MANAGER only)
- Delete users (OWNER only)
- Multi-tenant support with business isolation

### Products Management

- Create products with variations
- List all products (filtered by business)
- Update product information
- Delete products
- Product status management (ACTIVE, INACTIVE, DRAFT)
- Stock tracking and movements

### Purchase Orders

- Create purchase orders
- List all purchase orders
- Update purchase order status (DRAFT → SENT → CONFIRMED → RECEIVED)
- Track purchase order items

### Sales Orders

- Create sales orders
- List all sales orders
- Confirm orders (OWNER/MANAGER only)
- Cancel orders (OWNER/MANAGER only)
- Track sales order items

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user and business
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Users

- `GET /api/v1/user` - Get all users (OWNER/MANAGER only)
- `POST /api/v1/user` - Create new user (OWNER/MANAGER only)
- `PUT /api/v1/user/:id` - Update user (OWNER/MANAGER only)
- `DELETE /api/v1/user/:id` - Delete user (OWNER only)

### Products

- `GET /api/v1/product` - Get all products
- `POST /api/v1/product` - Create product (OWNER/MANAGER only)
- `PUT /api/v1/product/:id` - Update product (OWNER/MANAGER only)
- `DELETE /api/v1/product/:id` - Delete product (OWNER/MANAGER only)

### Purchase Orders

- `GET /api/v1/purchase-order` - Get all purchase orders
- `POST /api/v1/purchase-order` - Create purchase order
- `PUT /api/v1/purchase-order/:id` - Update purchase order
- `PUT /api/v1/purchase-order/:id/status` - Update purchase order status

### Sales Orders

- `GET /api/v1/sales-order` - Get all sales orders
- `POST /api/v1/sales-order` - Create sales order
- `PUT /api/v1/sales-order/:id/confirm` - Confirm order (OWNER/MANAGER only)
- `PUT /api/v1/sales-order/:id/cancel` - Cancel order (OWNER/MANAGER only)

## Role-Based Access Control

- **OWNER**: Full access to all features, can delete users
- **MANAGER**: Can manage products, users, and orders (except delete users)
- **STAFF**: Can view products and orders, create sales orders

## Error Handling

The backend uses a centralized error handling middleware that:

- Catches all errors and formats them consistently
- Returns appropriate HTTP status codes
- Provides user-friendly error messages

## Build for Production

```bash
npm run build
npm start
```

The compiled JavaScript will be in the `dist/` directory.

## Environment Variables

- `PORT` - Server port (default: `5001`)
- `MONGO_URI` - MongoDB connection string
- `API_PREFIX` - API route prefix (default: `/api/v1`)
- `FRONTEND_URL` - Frontend URL for CORS (default: `http://localhost:3000`)
- `JWT_SECRET` - Secret key for JWT token signing

## Notes

1. **Database**: Make sure MongoDB is running before starting the server. The connection string should be set in the `.env` file.

2. **Authentication**: JWT tokens are stored in HTTP-only cookies for security. Make sure the frontend is configured to send credentials with requests.

3. **Multi-Tenancy**: All data is isolated by business. Users can only access data belonging to their business.

4. **Error Handling**: All API errors are handled by the error middleware and return consistent error response formats.
