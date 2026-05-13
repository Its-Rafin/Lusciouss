document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // 1. THEME TOGGLER
    // ============================================================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    if (themeToggle) themeToggle.checked = (savedTheme === 'dark');

    if (themeToggle) {
        themeToggle.addEventListener('change', function () {
            const t = this.checked ? 'dark' : 'light';
            htmlEl.setAttribute('data-theme', t);
            localStorage.setItem('theme', t);
        });
    }

    // ============================================================
    // 2. STICKY NAVIGATION
    // ============================================================
    const stickyNav = document.getElementById('sticky-nav');
    if (stickyNav) {
        window.addEventListener('scroll', () => {
            stickyNav.classList.toggle('sticky-nav-active', window.scrollY > 64);
        }, { passive: true });
    }

    // ============================================================
    // 3. FLOATING ORB SCROLL PARALLAX
    // ============================================================
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    const orb3 = document.querySelector('.orb-3');

    if (orb1 || orb2 || orb3) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const y = window.scrollY;
                    if (orb1) orb1.style.transform = `translateY(${y * 0.15}px)`;
                    if (orb2) orb2.style.transform = `translateY(${-y * 0.1}px)`;
                    if (orb3) orb3.style.transform = `translateY(${y * 0.08}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================================
    // 4. MINI-CART STATE & PANEL
    // ============================================================
    let cart = JSON.parse(localStorage.getItem('lusciouss_cart') || '[]');

    function saveCart() {
        localStorage.setItem('lusciouss_cart', JSON.stringify(cart));
    }

    function updateCartBadge() {
        const badges = document.querySelectorAll('.cart-count-badge');
        const total = cart.reduce((s, i) => s + i.qty, 0);
        badges.forEach(b => {
            b.textContent = total;
            b.style.display = total > 0 ? 'flex' : 'none';
        });
        // Also update mini-cart item list if open
        renderMiniCart();
    }

    function renderMiniCart() {
        const listEl = document.getElementById('mini-cart-items');
        const subtotalEl = document.getElementById('mini-cart-subtotal');
        if (!listEl) return;

        if (cart.length === 0) {
            listEl.innerHTML = `<p class="text-center opacity-60 py-8">Your cart is empty</p>`;
            if (subtotalEl) subtotalEl.textContent = '$0.00';
            return;
        }

        listEl.innerHTML = cart.map((item, idx) => `
            <div class="flex gap-3 py-3 border-b border-current/10">
                <img src="${item.img}" alt="${item.name}" class="mini-cart-item-img">
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-sm truncate">${item.name}</p>
                    <p class="text-xs opacity-60">${item.size || 'M'} · ${item.color || 'Default'}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="window.cartQty(${idx}, -1)" class="qty-btn text-xs">−</button>
                        <span class="text-sm font-bold w-5 text-center">${item.qty}</span>
                        <button onclick="window.cartQty(${idx}, 1)" class="qty-btn text-xs">+</button>
                    </div>
                </div>
                <div class="text-right shrink-0">
                    <p class="font-bold text-sm">$${(item.price * item.qty).toFixed(2)}</p>
                    <button onclick="window.cartRemove(${idx})" class="text-xs opacity-50 hover:opacity-100 mt-1">✕</button>
                </div>
            </div>
        `).join('');

        if (subtotalEl) {
            const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
            subtotalEl.textContent = `$${sub.toFixed(2)}`;
        }
    }

    window.cartQty = function(idx, delta) {
        cart[idx].qty = Math.max(1, cart[idx].qty + delta);
        saveCart();
        updateCartBadge();
    };

    window.cartRemove = function(idx) {
        cart.splice(idx, 1);
        saveCart();
        updateCartBadge();
    };

    window.addToCart = function(name, price, img, size, color) {
        const existing = cart.find(i => i.name === name && i.size === size);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price: parseFloat(price), img, size: size || 'M', color: color || 'Default', qty: 1 });
        }
        saveCart();
        updateCartBadge();
        openMiniCart();
    };

    // Open / close mini cart
    const miniCartPanel = document.getElementById('mini-cart-panel');
    const miniCartOverlay = document.getElementById('mini-cart-overlay');

    function openMiniCart() {
        if (!miniCartPanel) return;
        miniCartPanel.classList.add('open');
        if (miniCartOverlay) miniCartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        renderMiniCart();
    }

    function closeMiniCart() {
        if (!miniCartPanel) return;
        miniCartPanel.classList.remove('open');
        if (miniCartOverlay) miniCartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    window.openMiniCart = openMiniCart;
    window.closeMiniCart = closeMiniCart;

    document.querySelectorAll('#mini-cart-btn, .mini-cart-trigger').forEach(btn => {
        btn.addEventListener('click', e => { e.preventDefault(); openMiniCart(); });
    });

    if (miniCartOverlay) miniCartOverlay.addEventListener('click', closeMiniCart);
    document.querySelectorAll('#mini-cart-close').forEach(b => b.addEventListener('click', closeMiniCart));

    // Init badge on load
    updateCartBadge();

    // ============================================================
    // 5. RIPPLE EFFECT ON BUTTONS
    // ============================================================
    document.querySelectorAll('.btn-lusciouss, .btn-shimmer').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.addEventListener('click', function (e) {
            const r = document.createElement('span');
            r.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            r.style.width = r.style.height = size + 'px';
            r.style.left = (e.clientX - rect.left - size / 2) + 'px';
            r.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
            this.appendChild(r);
            setTimeout(() => r.remove(), 700);
        });
    });

    // ============================================================
    // 6. TESTIMONIAL SLIDER
    // ============================================================
    const track = document.getElementById('testimonial-track');
    const dots  = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    if (track) {
        let current = 0;
        const slides = track.querySelectorAll('.testimonial-slide');
        const total = slides.length;
        let autoPlay;

        function goTo(idx) {
            current = (idx + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }

        function startAuto() {
            clearInterval(autoPlay);
            autoPlay = setInterval(() => goTo(current + 1), 4500);
        }

        dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));
        if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

        goTo(0);
        startAuto();
    }

    // ============================================================
    // 7. PRODUCT IMAGE GALLERY (detail page)
    // ============================================================
    const mainImg = document.getElementById('gallery-main-img');
    const thumbs  = document.querySelectorAll('.gallery-thumb');

    if (mainImg && thumbs.length) {
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', function () {
                const src = this.dataset.full || this.querySelector('img')?.src;
                if (!src) return;
                mainImg.style.opacity = '0';
                setTimeout(() => {
                    mainImg.src = src;
                    mainImg.style.opacity = '1';
                }, 200);
                mainImg.style.transition = 'opacity 0.2s ease';
                thumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // ============================================================
    // 8. SIZE SELECTOR
    // ============================================================
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const group = this.closest('.size-group');
            if (group) group.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ============================================================
    // 9. QUANTITY STEPPER (detail page)
    // ============================================================
    const qtyDisplay = document.getElementById('qty-display');
    const qtyMinus   = document.getElementById('qty-minus');
    const qtyPlus    = document.getElementById('qty-plus');

    if (qtyDisplay) {
        let qty = 1;
        if (qtyMinus) qtyMinus.addEventListener('click', () => { qty = Math.max(1, qty - 1); qtyDisplay.textContent = qty; });
        if (qtyPlus)  qtyPlus.addEventListener('click',  () => { qty++; qtyDisplay.textContent = qty; });
    }

    // ============================================================
    // 10. ACCORDION (product detail)
    // ============================================================
    document.querySelectorAll('.accordion-toggle').forEach(btn => {
        btn.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const icon    = this.querySelector('.accordion-icon');
            const isOpen  = content.classList.contains('open');
            // Close all
            document.querySelectorAll('.accordion-content.open').forEach(c => {
                c.classList.remove('open');
                const ic = c.previousElementSibling.querySelector('.accordion-icon');
                if (ic) ic.style.transform = 'rotate(0deg)';
            });
            if (!isOpen) {
                content.classList.add('open');
                if (icon) icon.style.transform = 'rotate(45deg)';
            }
        });
    });

    // ============================================================
    // 11. SHOP PAGE FILTERS
    // ============================================================
    const filterContainer = document.getElementById('filter-container');
    const productGrid     = document.getElementById('shop-product-grid');

    if (filterContainer && productGrid) {
        const cards = Array.from(productGrid.querySelectorAll('.shop-card'));
        const rangeEl = document.getElementById('price-range');
        const rangeVal = document.getElementById('price-range-val');
        const sortEl  = document.getElementById('sort-select');

        function applyFilters() {
            const activeCategories = Array.from(filterContainer.querySelectorAll('.cat-check:checked')).map(c => c.value);
            const activeSizes      = Array.from(filterContainer.querySelectorAll('.size-btn.active')).map(b => b.dataset.size);
            const maxPrice = rangeEl ? parseInt(rangeEl.value) : 9999;
            let visible = 0;

            cards.forEach(card => {
                const cat   = card.dataset.category || '';
                const price = parseFloat(card.dataset.price || 0);
                const sizes = (card.dataset.sizes || '').split(',');

                const catOk  = activeCategories.length === 0 || activeCategories.includes(cat);
                const priceOk = price <= maxPrice;
                const sizeOk  = activeSizes.length === 0 || activeSizes.some(s => sizes.includes(s));

                const show = catOk && priceOk && sizeOk;
                card.style.display = show ? '' : 'none';
                if (show) visible++;
            });
        }

        filterContainer.querySelectorAll('.cat-check').forEach(cb => cb.addEventListener('change', applyFilters));
        filterContainer.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                this.classList.toggle('active');
                applyFilters();
            });
        });

        if (rangeEl) {
            rangeEl.addEventListener('input', function () {
                if (rangeVal) rangeVal.textContent = '$' + this.value;
                applyFilters();
            });
        }

        if (sortEl) {
            sortEl.addEventListener('change', function () {
                const visibleCards = cards.filter(c => c.style.display !== 'none');
                visibleCards.sort((a, b) => {
                    if (this.value === 'price-asc')  return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                    if (this.value === 'price-desc') return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                    return 0;
                });
                visibleCards.forEach(c => productGrid.appendChild(c));
            });
        }

        // Load more
        const loadMoreBtn = document.getElementById('load-more-btn');
        const hiddenCards = productGrid.querySelectorAll('.shop-card.initially-hidden');
        if (loadMoreBtn && hiddenCards.length) {
            loadMoreBtn.addEventListener('click', function () {
                hiddenCards.forEach(c => c.classList.remove('initially-hidden'));
                this.style.display = 'none';
            });
        }
    }

    // ============================================================
    // 12. CART PAGE QTY & TOTALS
    // ============================================================
    const cartRows = document.querySelectorAll('.cart-qty-row');
    if (cartRows.length) {
        cartRows.forEach(row => {
            const minus   = row.querySelector('.cart-minus');
            const plus    = row.querySelector('.cart-plus');
            const display = row.querySelector('.cart-qty-display');
            const lineTotal = row.querySelector('.cart-line-total');
            const unitPrice = parseFloat(row.dataset.price || 0);
            let qty = parseInt(display?.textContent || 1);

            function updateRow() {
                if (display) display.textContent = qty;
                if (lineTotal) lineTotal.textContent = '$' + (unitPrice * qty).toFixed(2);
                updateCartTotal();
            }

            if (minus) minus.addEventListener('click', () => { qty = Math.max(1, qty - 1); updateRow(); });
            if (plus)  plus.addEventListener('click',  () => { qty++; updateRow(); });
        });

        function updateCartTotal() {
            let sub = 0;
            cartRows.forEach(row => {
                const qty = parseInt(row.querySelector('.cart-qty-display')?.textContent || 1);
                sub += parseFloat(row.dataset.price || 0) * qty;
            });
            const subtotalEl = document.getElementById('cart-subtotal');
            const totalEl    = document.getElementById('cart-total');
            if (subtotalEl) subtotalEl.textContent = '$' + sub.toFixed(2);
            if (totalEl)    totalEl.textContent    = '$' + (sub > 99 ? sub : sub + 9.99).toFixed(2);
        }

        updateCartTotal();
    }

    // Checkout steps
    const stepBtns = document.querySelectorAll('.checkout-next-btn');
    stepBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const currentStep = parseInt(this.dataset.step);
            const nextStep    = currentStep + 1;
            document.querySelectorAll('.checkout-step').forEach(s => s.classList.add('hidden'));
            const next = document.getElementById(`checkout-step-${nextStep}`);
            if (next) next.classList.remove('hidden');
            document.querySelectorAll('.step-circle').forEach((c, i) => {
                if (i < currentStep)     c.classList.add('done');
                if (i === currentStep)   c.classList.add('active');
            });
            document.querySelectorAll('.step-line').forEach((l, i) => {
                if (i < currentStep - 1) l.classList.add('done');
            });
        });
    });

    // ============================================================
    // 13. BEST SELLERS CAROUSEL (preserved)
    // ============================================================
    const carousel = document.querySelector('.product-carousel');
    if (carousel) {
        const cardsContainer = carousel.querySelector('.cards__container');
        if (cardsContainer) {
            let cards = Array.from(cardsContainer.querySelectorAll('.box'));
            let autoSlideInterval;

            const updateCarousel = () => {
                const midIdx = Math.floor(cards.length / 2);
                cards.forEach((card, i) => {
                    const offset = i - midIdx;
                    card.className = card.className.replace(/\bposition-\S+/g, '');
                    card.classList.add(`position-${offset}`);
                    const tooltip = card.querySelector('.tooltip');
                    if (tooltip) {
                        offset === 0 ? tooltip.classList.add('tooltip-open') : tooltip.classList.remove('tooltip-open');
                    }
                });
            };

            window.shiftLeft = () => {
                cards.unshift(cards.pop());
                cards.forEach(c => cardsContainer.appendChild(c));
                updateCarousel();
            };

            window.shiftRight = () => {
                cards.push(cards.shift());
                cards.forEach(c => cardsContainer.appendChild(c));
                updateCarousel();
            };

            const startAuto = () => {
                clearInterval(autoSlideInterval);
                autoSlideInterval = setInterval(shiftRight, 3000);
            };

            updateCarousel();
            startAuto();
            cardsContainer.addEventListener('click', () => clearInterval(autoSlideInterval));
        }
    }

    // ============================================================
    // 14. NEWSLETTER FORM
    // ============================================================
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"]');
            const btn   = this.querySelector('button[type="submit"]');
            if (!input?.value) return;
            const orig = btn.textContent;
            btn.textContent = '✓ You\'re in!';
            btn.disabled = true;
            input.value = '';
            setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3500);
        });
    });

    // ============================================================
    // 15. PAGE TRANSITION
    // ============================================================
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.25s ease';
            setTimeout(() => { window.location.href = href; }, 260);
        });
    });

});