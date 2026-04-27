// login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export class LoginDto {
  @ApiProperty({ example: 'user@foxyjob.com' })
  email!: string;

  @ApiProperty({ example: 'password123' })
  password!: string;
}