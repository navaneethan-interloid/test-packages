import {
  createZodDto,
  matchField,
  phoneNumberSchema,
  slugSchema,
  strongPasswordSchema,
} from '@interloid/validation';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email(),
  password: strongPasswordSchema(),
  userName: slugSchema,
  phone: phoneNumberSchema('IN'),
});

export class LoginDto extends createZodDto(LoginSchema) {
  @ApiProperty({
    example: 'user@foxyjob.com',
    description: 'Registered email address',
  })
  email!: string;

  @ApiProperty({ example: 'Password@123', description: 'Account password' })
  password!: string;

  // @ApiProperty({
  //   example: '+919876543210',
  //   description: 'Registered phone number',
  // })
  // phone!: string;

  @ApiProperty({
    example: 'naveen-dev',
    description: 'Unique profile username slug',
  })
  userName!: string;
}

export const RegisterSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .superRefine(
    matchField('password', 'confirmPassword', 'Password not matching'),
  );
export class ChangePasswordDto extends createZodDto(RegisterSchema) {}
