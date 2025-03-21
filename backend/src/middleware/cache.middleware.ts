import { Request, Response, NextFunction } from 'express';
import { redisService } from '../lib/redis';
import { logger } from '../lib/logger';

interface CacheOptions {
  ttl?: number;
  key?: (req: Request) => string;
}

const defaultKeyGenerator = (req: Request): string => {
  return `${req.method}:${req.originalUrl}`;
};

export const cache = (options: CacheOptions = {}) => {
  const ttl = options.ttl || parseInt(process.env.REDIS_TTL || '3600');
  const keyGenerator = options.key || defaultKeyGenerator;

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!redisService.getStatus()) {
      return next();
    }

    const key = keyGenerator(req);

    try {
      const cachedData = await redisService.get(key);
      if (cachedData) {
        logger.debug(`Cache hit for key: ${key}`);
        return res.json(cachedData);
      }

      // Store the original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response before sending
      res.json = ((data: any) => {
        // Restore the original res.json function
        res.json = originalJson;

        // Cache the data
        redisService.set(key, data, ttl).catch((error) => {
          logger.error('Error caching response:', error);
        });

        // Send the response
        return originalJson(data);
      }) as any;

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
}; 