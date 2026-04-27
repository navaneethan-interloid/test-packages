// libs/core/src/lib/pipes/zod-validation.pipe.ts
import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (result.success) {
      return result.data;
    }
    // We throw the raw ZodError.
    // Your GlobalExceptionFilter will catch this and format the 'errors' array.
    throw result.error;
  }
}
