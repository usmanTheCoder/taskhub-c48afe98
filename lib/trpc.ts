import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { ZodError } from 'zod';

import { appRouter } from '@/server/routers/_app';

export const transformer = superjson;

export const api = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer,
      links: [
        httpBatchLink({
          url: '/api/trpc',
          headers() {
            if (ctx?.req) {
              const { req } = ctx;
              const headers = {
                cookie: req.headers.cookie,
              };
              return headers;
            }
            return {};
          },
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: Infinity,
          },
        },
      },
    };
  },
  responseMeta({ error, type, path, input }) {
    if (error?.cause instanceof ZodError) {
      return {
        status: 400,
        error: {
          message: 'Invalid input',
          code: 'VALIDATION_ERROR',
          issues: error.cause.issues,
        },
      };
    } else if (error?.code === 'INTERNAL_SERVER_ERROR') {
      return { status: 500, error };
    } else if (error?.code === 'UNAUTHORIZED') {
      return { status: 401, error };
    }

    return {
      status: 500,
      error: {
        message: 'An unknown error occurred.',
        code: 'INTERNAL_SERVER_ERROR',
      },
    };
  },
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;