import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/mobile/**/*.tsx',
        './resources/mobile/**/*.css',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Almarai"', ...defaultTheme.fontFamily.sans],
            },
            animation: {
                blob: "blob 7s infinite",
                scroll: "scroll 20s linear infinite",
                "fade-in": "fadeIn 0.5s ease-out forwards",
                "fade-in-up": "fadeInUp 0.7s ease-out forwards",
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
                scroll: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },

    safelist: [
        // Gradient classes for carousel
        'from-blue-500',
        'to-indigo-600',
        'from-green-500',
        'to-cyan-600',
        'from-orange-500',
        'to-pink-600',
        'from-red-500',
        'to-orange-600',
        'from-purple-500',
        'to-pink-600',
        'from-teal-500',
        'to-emerald-600',
    ],

    plugins: [forms],
};
