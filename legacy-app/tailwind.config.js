/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./agenda.html",
        "./admin.html",
        "./dinner.html",
        "./merch.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./main.js",
        "./home.js",
        "./admin.js",
        "./app.js",
        "./dinner.js",
        "./merch.js",
        "./event.js"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                tusker: ['"Tusker Grotesk"', 'Inter', 'sans-serif'],
            },
            colors: {
                'brand-green': '#00A651',
                'brand-gray': '#F5F5F5',
                'text-primary': '#111111',
                'text-secondary': '#666666',
                'accent': {
                    orange: '#f97316',
                    'orange-dark': '#ea580c',
                    amber: '#fbbf24',
                },
            },
        },
    },
    plugins: [],
}
