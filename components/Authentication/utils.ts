import bcrypt from 'bcryptjs';
import { serialize, parse } from 'cookie';
import { createRouter } from '../../../server/context';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

const createSerializedRegisterSessionTokenCookie = async (token: string) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  };

  const serializedCookie = serialize('TASKHUB_ACCESS_TOKEN', token, cookieOptions);
  return serializedCookie;
};

const createSerializedAuthSessionCookie = async (userId: string) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  };

  const serializedCookie = serialize('TASKHUB_USER_ID', userId, cookieOptions);
  return serializedCookie;
};

const getAuthSessionCookie = (req: Request) => {
  const cookie = req.headers.get('cookie');
  if (!cookie) return null;
  const parsedCookie = parse(cookie);
  return parsedCookie.TASKHUB_USER_ID;
};

const router = createRouter()
  .mutation('register', {
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
    }),
    resolve: async ({ input }) => {
      if (input.password !== input.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await hashPassword(input.password);

      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
        },
      });

      return { status: 'success', userId: user.id };
    },
  })
  .mutation('login', {
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    resolve: async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await comparePasswords(input.password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      return { status: 'success', userId: user.id };
    },
  });

export const authUtils = {
  hashPassword,
  comparePasswords,
  createSerializedRegisterSessionTokenCookie,
  createSerializedAuthSessionCookie,
  getAuthSessionCookie,
  router,
};