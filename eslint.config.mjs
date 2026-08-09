import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = [
    ...nextCoreWebVitals,
    ...nextTypescript,
    prettier,
    {
        ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    },
    {
        rules: {
            'react/jsx-curly-brace-presence': ['error', { props: 'always', children: 'ignore' }],
            quotes: ['error', 'single'],
        },
    },
];

export default eslintConfig;
