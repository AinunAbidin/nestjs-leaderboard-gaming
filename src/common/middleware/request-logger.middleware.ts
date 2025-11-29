import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { mkdir, appendFile } from 'node:fs/promises';
import { join } from 'node:path';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
      const durationMs = Date.now() - startedAt;
      const logLine = `[${new Date().toISOString()}] ${ip} ${method} ${originalUrl} ${res.statusCode} ${durationMs}ms\n`;
      void this.writeLog(logLine);
    });

    next();
  }

  private async writeLog(logLine: string) {
    try {
      const logsDir = 'logs';
      await mkdir(logsDir, { recursive: true });
      await appendFile(join(logsDir, 'requests.log'), logLine);
    } catch (error) {
      // Log to console as a fallback; avoid throwing inside middleware listeners

      console.error('Failed to write request log', error);
    }
  }
}
