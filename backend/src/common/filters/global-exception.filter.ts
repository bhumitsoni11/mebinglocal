import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      
      message = typeof res === 'string' ? res : res.message || exception.message;
      code = typeof res === 'string' ? 'HTTP_ERROR' : res.error || 'HTTP_ERROR';
      
      // Handle class-validator validation errors array
      if (Array.isArray(message)) {
        message = message.join(', ');
        code = 'VALIDATION_ERROR';
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors gracefully
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'A record with this value already exists.';
        code = 'UNIQUE_CONSTRAINT_VIOLATION';
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found.';
        code = 'NOT_FOUND';
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = 'Database operation failed.';
        code = 'DATABASE_ERROR';
      }
      this.logger.warn(`Prisma Error ${exception.code}: ${exception.message}`);
    } else {
      this.logger.error('Unhandled Exception', exception instanceof Error ? exception.stack : exception);
    }

    response.status(status).send({
      success: false,
      message,
      code,
    });
  }
}
