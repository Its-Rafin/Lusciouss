document.addEventListener('DOMContentLoaded', function () {
    // --- Theme Toggler Logic (You should already have this) ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        themeToggle.checked = (savedTheme === 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', function () {
        if (this.checked) {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- Sticky Navigation Logic (Add this part) ---
    const stickyNav = document.getElementById('sticky-nav');
    const scrollThreshold = 250; // The nav will appear after scrolling 250px

    // Check if the stickyNav element exists before adding the event listener
    if (stickyNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                stickyNav.classList.add('sticky-nav-active');
            } else {
                stickyNav.classList.remove('sticky-nav-active');
            }
        });
    }
});