import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import requestContext from '../context/request.js';
import getCurrentUser from '../services/getCurrentUser.js';

const prisma = new PrismaClient();

// Models that have timestamp and tracking fields
const modelsWithTimestamps = [
    'User', 'Faculty', 'Major', 'Course', 'News'
];

// Middleware for adding UUID, timestamps, and user fields
prisma.$use(async (params, next) => {
    try {
        const req = requestContext.get();
        let userId = null;

        if (req) {
            try {
                userId = getCurrentUser(req);
                console.log('User context available:', userId);
            } catch (error) {
                console.log('No user context available:', error.message);
            }
        }

        // Always ensure ID is set for create operations
        if (params.action === 'create' && !params.args.data.id) {
            params.args.data.id = params.args.data.id || uuidv4();
        }

        // Only add timestamp fields for models that have them
        if (params.action === 'create' && modelsWithTimestamps.includes(params.model)) {
            params.args.data = {
                ...params.args.data,
                created_at: new Date(),
                created_by: userId || null,
                updated_at: null,
                updated_by: null,
                is_deleted: false,
                deleted_by: null,
                deleted_at: null,
            };
        }

        if (params.action === 'createMany') {
            if (Array.isArray(params.args.data)) {
                params.args.data = params.args.data.map((item) => {
                    // Always ensure ID is set
                    const withId = {
                        ...item,
                        id: item.id || uuidv4(),
                    };
                    
                    // Only add timestamp fields for models that have them
                    if (modelsWithTimestamps.includes(params.model)) {
                        return {
                            ...withId,
                            created_at: new Date(),
                            created_by: userId || null,
                            updated_at: null,
                            updated_by: null,
                            is_deleted: false,
                            deleted_by: null,
                            deleted_at: null,
                        };
                    }
                    
                    return withId;
                });
            }
        }

        if ((params.action === 'update' || params.action === 'updateMany') && modelsWithTimestamps.includes(params.model)) {
            if (userId) {
                if (!params.args.data) {
                    params.args.data = {};
                }

                if (params.args.data.is_deleted) {
                    params.args.data = {
                        ...params.args.data,
                        is_deleted: true,
                        deleted_by: userId,
                        deleted_at: new Date(),
                    };
                }

                params.args.data.updated_by = userId;
                params.args.data.updated_at = new Date();
            }
        }

        if ((params.action === 'delete' || params.action === 'deleteMany') && modelsWithTimestamps.includes(params.model)) {
            if (userId) {
                params.action = 'update';
                if (!params.args.data) {
                    params.args.data = {};
                }
                
                params.args.data = {
                    ...params.args.data,
                    is_deleted: true,
                    deleted_by: userId,
                    deleted_at: new Date(),
                };
            }
        }
    } catch (error) {
        console.error('Error in Prisma middleware:', error);
    }

    return next(params);
});

// Middleware example for logging
prisma.$use(async (params, next) => {
    const before = Date.now();

    const result = await next(params);

    const after = Date.now();
    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

    return result;
});

export default prisma;
