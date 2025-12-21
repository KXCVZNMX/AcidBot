import 'next-auth';
import NextAuth, { DefaultSession } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email?: string;
            name?: string;
            clal: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        name?: string;
        clal: string;
    }
}
