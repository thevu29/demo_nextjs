import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import db from './app/lib/db';
import type { User } from './app/lib/definitions';
import { authConfig } from './auth.config';
import { z } from 'zod';

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await db.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true
            }
        });

        return user || undefined;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);

                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials')
                return null;
            }
        })
    ]
});