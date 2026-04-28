import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import client from './lib/db';

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!githubClientId || !githubClientSecret) {
    throw new Error(
        'Missing required environment variables: GITHUB_CLIENT_ID and/or GITHUB_CLIENT_SECRET'
    );
}

if (!googleClientId || !googleClientSecret) {
    throw new Error(
        'Missing required environment variables: GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET'
    );
}

export const auth = betterAuth({
    database: mongodbAdapter(client.db()),
    user: {
        modelName: 'users',
        additionalFields: {
            username: {
                type: 'string',
                required: false,
                input: false,
                defaultValue: '',
            },
            clal: {
                type: 'number',
                required: false,
                input: false,
                defaultValue: 0,
            },
        },
    },
    session: {
        modelName: 'sessions',
        expiresIn: 60 * 60 * 24 * 30, // 30 days
    },
    account: {
        modelName: 'accounts',
    },
    socialProviders: {
        github: {
            clientId: githubClientId,
            clientSecret: githubClientSecret,
        },
        google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    return {
                        data: {
                            username: user.name,
                            clal: 0,
                        },
                    };
                },
            },
        },
    },
});
