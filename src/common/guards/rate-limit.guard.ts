import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

interface RateLimitEntry {
  timestamps: number[];
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const rateLimitStore = new Map<number, RateLimitEntry>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { id?: number } }>();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('Missing user context for rate limiting');
    }

    const now = Date.now();
    const windowStart = now - WINDOW_MS;
    const entry = rateLimitStore.get(userId) ?? { timestamps: [] };
    const recentRequests = entry.timestamps.filter(
      (timestamp) => timestamp > windowStart,
    );
    recentRequests.push(now);

    if (recentRequests.length > MAX_REQUESTS) {
      throw new ForbiddenException('Rate limit exceeded for /scores');
    }

    rateLimitStore.set(userId, { timestamps: recentRequests });
    return true;
  }
}
