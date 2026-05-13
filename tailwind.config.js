/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html", "./js/**/*.js"],
    theme: {
        extend: {
            fontFamily: {
                header: ['"Playfair Display"', 'serif'],
                body: ['"Inter"', 'sans-serif'],
            },
            colors: {
                burgundy: '#8a0516',
                gold: '#C9A959',
                cream: '#ffefd9',
                dustyrose: '#D9AAB7',
            },
            animation: {
                'float-slow': 'float-orb 12s ease-in-out infinite',
                'float-mid': 'float-orb 9s ease-in-out infinite reverse',
                'float-fast': 'float-orb 7s ease-in-out infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'slide-in-right': 'slide-in-right 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
                'fade-in-up': 'fade-in-up 0.6s ease forwards',
            },
            keyframes: {
                'float-orb': {
                    '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                    '33%': { transform: 'translateY(-30px) translateX(15px)' },
                    '66%': { transform: 'translateY(15px) translateX(-20px)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0%)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
};