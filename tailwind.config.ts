import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/theme/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            container: {
                center: true,
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            keyframes: {
                pop: {
                    '0%, 100%': {
                        transform: 'scale(1)',
                    },
                    '50%': {
                        transform: 'scale(1.25)',
                    },
                },
                loadbar: {
                    '0%, 100%': {
                        transform: 'translate(-50%)',
                    },
                    '50%': {
                        transform: 'translate(150%)',
                    },
                },
            },
            animation: {
                pop: 'pop 0.25s linear',
                loadbar: 'loadbar 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            },
        },
    },
    plugins: [],
}
export default config
