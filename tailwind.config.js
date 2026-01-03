/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./agenda.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./main.js",
        "./home.js"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                'brand-green': '#00A651',
                'brand-gray': '#F5F5F5',
                'text-primary': '#111111',
                'text-secondary': '#666666',
            }
        },
    },
    plugins: [],
}
