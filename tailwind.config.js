/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html", "./js/**/*.js"],
    theme: {
        extend: {},
    },
    daisyui: {
        themes: ["light", "dark", "luxury", "cupcake"],
    },
};
