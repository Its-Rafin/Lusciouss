// js/main.js

// Theme JS
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


// New Arrivals Carousel Js


// Define functions globally so HTML onclick can find them
let shiftLeft, shiftRight;

window.addEventListener('load', () => {

    function updateTooltip() {
        document.querySelectorAll('.img-items').forEach(el => {
            el.classList.remove('tooltip-open');
        });

        // Select the 4th child currently in the middle
        const middleCard = document.querySelector(".cards__container .box:nth-child(4) .img-items");
        if (middleCard) {
            middleCard.classList.add('tooltip-open');
        }
    }

    shiftLeft = function () {
        const boxes = document.querySelectorAll(".box");
        const tmpNode = boxes[0];
        boxes[0].className = "box move-out-from-left";

        setTimeout(function () {
            if (boxes.length > 7) {
                tmpNode.classList.add("box--hide");
                boxes[7].className = "box move-to-position5-from-left";
            }
            boxes[1].className = "box move-to-position1-from-left";
            boxes[2].className = "box move-to-position2-from-left";
            boxes[3].className = "box move-to-position3-from-left";
            boxes[4].className = "box move-to-position4-from-left";
            boxes[5].className = "box move-to-position5-from-left";
            boxes[6].className = "box move-to-position6-from-left";
            boxes[0].remove();

            document.querySelector(".cards__container").appendChild(tmpNode);
            updateTooltip();
        }, 600);
    }

    shiftRight = function () {
        const boxes = document.querySelectorAll(".box");
        if (boxes.length < 2) return;

        boxes[6].className = "box move-out-from-right";

        setTimeout(function () {
            const noOfCards = boxes.length;
            if (noOfCards > 6) {
                boxes[6].className = "box box--hide";
            }

            const tmpNode = boxes[noOfCards - 1];
            tmpNode.classList.remove("box--hide");
            boxes[noOfCards - 1].remove();

            let parentObj = document.querySelector(".cards__container");
            parentObj.insertBefore(tmpNode, parentObj.firstChild);

            tmpNode.className = "box move-to-position1-from-right";
            boxes[0].className = "box move-to-position2-from-right";
            boxes[1].className = "box move-to-position3-from-right";
            boxes[2].className = "box move-to-position4-from-right";
            boxes[3].className = "box move-to-position5-from-right";
            boxes[4].className = "box move-to-position6-from-right";
            boxes[5].className = "box move-to-position7-from-right";

            updateTooltip();
        }, 600);
    }

    // Initialize tooltip on load
    updateTooltip();

    // AUTOMATED CAROUSEL
    // Since you don't have a specific class on the button, 
    // we call the function directly.
    setInterval(() => {
        shiftRight();
    }, 4000); // 4 seconds is better for 3D animations

});
// --------------------End--------------

