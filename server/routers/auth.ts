import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { createRouter } from "../createRouter";

const prisma = new PrismaClient();

export const authRouter = createRouter()
  .mutation("register", {
    input: z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8),
    }),
    async resolve({ input }) {
      const { name, email, password } = input;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return { user: { id: user.id, name: user.name, email: user.email } };
    },
  })
  .mutation("login", {
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    async resolve({ input }) {
      const { email, password } = input;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      return { user: { id: user.id, name: user.name, email: user.email } };
    },
  });
```





   - Checks if a user with the provided email already exists in the database.
   - If a user exists, throws an error.
   - Hashes the provided password using `bcrypt.hash`.
   - Creates a new user in the database with the provided name, email, and hashed password.
   - Returns an object with the user's ID, name, and email.

   - Finds a user in the database with the provided email.
   - If no user is found, throws an error.
   - Compares the provided password with the user's hashed password using `bcrypt.compare`.
   - If the passwords don't match, throws an error.
   - Returns an object with the user's ID, name, and email.

This router can be imported and used in other parts of the application to handle user authentication and registration.