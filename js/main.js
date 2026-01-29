// js/main.js

const themeToggle = document.querySelector('#theme-toggle');
const htmlElement = document.documentElement;

// 1. Function to apply theme
const applyTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

// 2. Initialize: Sync toggle state with current saved theme
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
    themeToggle.checked = true;
} else {
    themeToggle.checked = false;
}

// 3. Listen for Clicks
themeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
});
