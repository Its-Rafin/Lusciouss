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
    const scrollThreshold = 64; // The nav will appear after scrolling 250px

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

    // --- Carousel Logic ---
    const carousel = document.querySelector('.product-carousel');
    if (carousel) {
        const cardsContainer = carousel.querySelector('.cards__container');
        let cards = Array.from(cardsContainer.querySelectorAll('.box'));
        const leftButton = document.getElementById('carousel-btn-left');
        const rightButton = document.getElementById('carousel-btn-right');
        let autoSlideInterval;

        const updateCarousel = () => {
            const middleIndex = Math.floor(cards.length / 2);
            cards.forEach((card, i) => {
                const offset = i - middleIndex;
                // Remove all old position classes
                card.className = card.className.replace(/\bposition-\S+/g, '');
                // Add the new position class
                card.classList.add(`position-${offset}`);

                // Handle tooltip visibility for the center card
                const tooltip = card.querySelector('.tooltip');
                if (tooltip) {
                    offset === 0 ? tooltip.classList.add('tooltip-open') : tooltip.classList.remove('tooltip-open');
                }
            });
        };

        window.shiftLeft = () => {
            // Move the last element to the beginning of the array
            cards.unshift(cards.pop());
            // Re-append all cards in the new order
            cards.forEach(card => cardsContainer.appendChild(card));
            updateCarousel();
        };

        window.shiftRight = () => {
            // Move the first element to the end of the array
            cards.push(cards.shift());
            // Re-append all cards in the new order
            cards.forEach(card => cardsContainer.appendChild(card));
            updateCarousel();
        };

        const startAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                shiftRight();
            }, 3000);
        };

        // Initial setup
        updateCarousel();
        startAutoSlide();

        // Pause on click
        cardsContainer.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
        });
    }
});