/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./*.html",
        "./index.html",
        "./assets/js/**/*.js"  // Scansiona anche il JS per le classi dinamiche
    ],
    theme: {
        extend: {
            colors: {
                primary: '#b26cba',
                secondary: '#cb8dd6',
                neutral: '#fef8ff',
                dark: '#3c2840',
                accent: '#d4789e',
                highlight: '#fcc4ff',
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Lato', 'Helvetica', 'Arial', 'sans-serif'],
            },
        }
    },
    plugins: [],
}

