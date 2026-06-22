import NextAuth, { Session, User } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { ObjectId } from 'mongodb';
import client from './lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
    // Cast through unknown to avoid cross-package Adapter nominal mismatch when lockfile still has mixed @auth/core versions.
    adapter: MongoDBAdapter(client) as unknown as Adapter,
    providers: [GitHub, Google],

    session: {
        strategy: 'database',
    },

    events: {
        async createUser({ user }: { user: User }) {
            const db = client.db();
            await db.collection('users').updateOne(
                { _id: new ObjectId(user!.id) },
                {
                    $set: {
                        username: user.name,
                        clal: 0,
                        createdAt: new Date(),
                    },
                }
            );
        },
    },

    callbacks: {
        async session({ session, user }: { session: Session; user: User }) {
            if (session.user) {
                session.user.id = user.id;
                session.user.clal = user.clal;
            }
            return session;
        },
    },
});
