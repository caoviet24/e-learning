import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Middleware for adding UUID and is_deleted fields
prisma.$use(async (params, next) => {
    // Tạo đối tượng Date hiện tại
    const now = new Date();

    // Chuyển đổi sang múi giờ UTC+7 (Việt Nam) và định dạng ISO
    const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString();

    if (params.action === 'create') {
        params.args.data = {
            ...params.args.data,
            id: uuidv4(),
            created_at: vietnamTime,
            updated_at: vietnamTime,
            is_deleted: false,
        };
    }

    if (params.action === 'createMany') {
        if (Array.isArray(params.args.data)) {
            params.args.data = params.args.data.map((item) => ({
                ...item,
                id: uuidv4(),
                created_at: vietnamTime,
                updated_at: vietnamTime,
                is_deleted: false,
            }));
        }
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

// Middleware for soft delete (if needed)
/*
prisma.$use(async (params, next) => {
  if (params.action === 'delete') {
    params.action = 'update';
    params.args['data'] = { deleted: true };
  }
  if (params.action === 'deleteMany') {
    params.action = 'updateMany';
    if (params.args.data !== undefined) {
      params.args.data['deleted'] = true;
    } else {
      params.args['data'] = { deleted: true };
    }
  }
  return next(params);
});
*/

export default prisma;
