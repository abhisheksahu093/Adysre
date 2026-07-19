import { BadRequestException, PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';

/**
 * Validates a request payload against a Zod schema (from @adysre/validators),
 * so web and api share one source of validation truth.
 *
 * Usage: `@Body(new ZodValidationPipe(loginSchema)) dto: LoginInput`
 */
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(
        result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
      );
    }
    return result.data;
  }
}
