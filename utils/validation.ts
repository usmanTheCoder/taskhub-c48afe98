import { z } from 'zod';

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be at most 50 characters long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(100, 'Email must be at most 100 characters long')
    .regex(emailRegex, 'Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be at most 32 characters long'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(100, 'Email must be at most 100 characters long')
    .regex(emailRegex, 'Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be at most 32 characters long'),
});

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be at most 1000 characters long'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TaskInput = z.infer<typeof taskSchema>;