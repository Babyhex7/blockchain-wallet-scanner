/**
 * Request Validator Middleware
 * Validasi request body menggunakan Zod
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Scan Request Schema
 */
export const ScanRequestSchema = z.object({
  address: z.string()
    .min(42, 'Address must be 42 characters')
    .max(42, 'Address must be 42 characters')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid address format'),
  chainId: z.number()
    .int('Chain ID must be integer')
    .refine(
      (val) => [1, 137, 56].includes(val),
      'Unsupported chain ID. Supported: 1 (Ethereum), 137 (Polygon), 56 (BSC)'
    )
});

export type ScanRequest = z.infer<typeof ScanRequestSchema>;

/**
 * Validate request body against schema
 */
export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        throw new ValidationError(messages.join(', '));
      }
      throw error;
    }
  };
}
