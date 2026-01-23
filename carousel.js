// carousel.js
document.addEventListener("DOMContentLoaded", () => {
    const carouselEl = document.getElementById("auto-play");
    if (carouselEl && window.FlyonUI?.Carousel) {
        new FlyonUI.Carousel(carouselEl, {
            loadingClasses: "opacity-0",
            isAutoPlay: true,
            speed: 1000,
        });
    }
});
