module.exports = {
    content: ['./**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'card-bg': '#3a2450', // dark purple card background
                'card-accent': '#6f3bd6', // small accents
                'badge-blue': '#4fc3f7',
                percent: '#ffffff',
                muted: '#cfc7d8',
            },
        },
    },
    plugins: [],
};
