/**
 * Sophie Travel Designer - Main JavaScript
 * Handles navigation, scroll effects, and animations
 */

(function () {
    'use strict';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================

    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    const fadeElements = document.querySelectorAll('.fade-in-element');

    // ==========================================================================
    // Navigation - Scroll Effect
    // ==========================================================================

    /**
     * Handle navbar appearance on scroll
     * Adds 'scrolled' class when page is scrolled past threshold
     */
    function handleNavbarScroll() {
        const scrollThreshold = 100;

        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ==========================================================================
    // Mobile Menu Toggle
    // ==========================================================================

    /**
     * Toggle mobile menu open/closed
     */
    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.contains('open');

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        // Force reflow for animation
        mobileMenu.offsetHeight;
        mobileMenu.classList.add('open');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');

        // Update hamburger icon to X
        updateMenuIcon(true);
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');

        // Update X icon to hamburger
        updateMenuIcon(false);

        // Hide menu after animation
        setTimeout(() => {
            if (!mobileMenu.classList.contains('open')) {
                mobileMenu.classList.add('hidden');
            }
        }, 300);
    }

    /**
     * Update menu icon between hamburger and X
     * @param {boolean} isOpen - Whether menu is open
     */
    function updateMenuIcon(isOpen) {
        const menuIcon = document.getElementById('menu-icon');

        if (isOpen) {
            menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        } else {
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        }
    }

    // ==========================================================================
    // Smooth Scroll
    // ==========================================================================

    /**
     * Handle smooth scroll for anchor links
     * @param {Event} e - Click event
     */
    function handleSmoothScroll(e) {
        const href = this.getAttribute('href');

        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Calculate offset for fixed navbar
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mobileMenu.classList.contains('open')) {
                    closeMobileMenu();
                }
            }
        }
    }

    // ==========================================================================
    // Scroll Animations (IntersectionObserver)
    // ==========================================================================

    /**
     * Initialize scroll-triggered animations
     * Uses IntersectionObserver for performance
     */
    function initScrollAnimations() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements immediately
            fadeElements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => observer.observe(el));
    }

    // ==========================================================================
    // Active Navigation Link
    // ==========================================================================

    /**
     * Update active navigation link based on scroll position
     */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('#navbar a[href^="#"]');

        let currentSection = '';
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-secondary');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('text-secondary');
            }
        });
    }

    // ==========================================================================
    // Form Validation Enhancement
    // ==========================================================================

    /**
     * Enhance form with custom validation feedback
     */
    function initFormValidation() {
        const form = document.querySelector('form');

        if (!form) return;

        form.addEventListener('submit', function (e) {
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            // Show loading state
            submitButton.textContent = 'Invio in corso...';
            submitButton.disabled = true;

            // Note: Formspree handles the actual submission
            // This is just for UX feedback

            // Reset button after a delay (in case form doesn't redirect)
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 5000);
        });

        // Real-time validation feedback
        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (this.validity.valid) {
                    this.classList.remove('border-red-500');
                    this.classList.add('border-green-500/50');
                } else if (this.value) {
                    this.classList.add('border-red-500');
                    this.classList.remove('border-green-500/50');
                }
            });

            input.addEventListener('input', function () {
                if (this.validity.valid) {
                    this.classList.remove('border-red-500');
                }
            });
        });
    }

    // ==========================================================================
    // Parallax Effect (Subtle)
    // ==========================================================================

    /**
     * Apply subtle parallax to hero background
     */
    function initParallax() {
        const heroImage = document.querySelector('#hero img');

        if (!heroImage) return;

        // Only apply on larger screens
        if (window.innerWidth < 768) return;

        let ticking = false;

        function updateParallax() {
            const scrolled = window.scrollY;
            const heroHeight = document.getElementById('hero').offsetHeight;

            if (scrolled < heroHeight) {
                const translateY = scrolled * 0.3;
                heroImage.style.transform = `translateY(${translateY}px) scale(1.1)`;
            }

            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // ==========================================================================
    // Performance: Throttle/Debounce Helpers
    // ==========================================================================

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Minimum time between calls (ms)
     * @returns {Function} Throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ==========================================================================
    // Event Listeners
    // ==========================================================================

    /**
     * Initialize all event listeners
     */
    function initEventListeners() {
        // Scroll events (throttled for performance)
        const throttledScrollHandler = throttle(() => {
            handleNavbarScroll();
            updateActiveNavLink();
        }, 100);

        window.addEventListener('scroll', throttledScrollHandler, { passive: true });

        // Mobile menu toggle
        menuToggle.addEventListener('click', toggleMobileMenu);

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (mobileMenu.classList.contains('open') &&
                !mobileMenu.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Close mobile menu on link click
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Handle resize
        window.addEventListener('resize', throttle(() => {
            // Close mobile menu on larger screens
            if (window.innerWidth >= 768 && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        }, 200));

        // Handle escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

    // ==========================================================================
    // Initialize
    // ==========================================================================

    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        // Check initial scroll position
        handleNavbarScroll();

        // Initialize scroll animations
        initScrollAnimations();

        // Initialize event listeners
        initEventListeners();

        // Initialize form validation
        initFormValidation();

        // Initialize async contact form
        initContactForm();

        // Initialize parallax (optional)
        initParallax();

        // Console message
        console.log('%c✈️ Sophie Travel Designer', 'font-size: 24px; color: #b26cba; font-weight: bold;');
        console.log('%cViaggi su misura, pensati per te', 'font-size: 14px; color: #cb8dd6;');
    }

    // ==========================================================================
    // FAQ Accordion Toggle
    // ==========================================================================

    /**
     * Toggle FAQ accordion item
     * @param {HTMLElement} button - The toggle button clicked
     */
    window.toggleFaq = function (button) {
        const faqItem = button.closest('.faq-item');
        const content = faqItem.querySelector('.faq-content');
        const isOpen = faqItem.classList.contains('open');

        // Close all other FAQ items
        document.querySelectorAll('.faq-item.open').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('open');
                item.querySelector('.faq-content').classList.add('hidden');
            }
        });

        // Toggle current item
        if (isOpen) {
            faqItem.classList.remove('open');
            content.classList.add('hidden');
        } else {
            faqItem.classList.add('open');
            content.classList.remove('hidden');
        }
    };

    // ==========================================================================
    // Contact Form - Async Submit with Beautiful UX
    // ==========================================================================

    /**
     * Initialize contact form with async submission
     */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');
        const formSuccess = document.getElementById('form-success');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Show loading state (spinner only)
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnSpinner.classList.remove('hidden');

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success: hide button, show success message, freeze form
                    submitBtn.classList.add('hidden');
                    formSuccess.classList.remove('hidden');

                    // Freeze all form fields (user can see what they sent)
                    const inputs = form.querySelectorAll('input, textarea');
                    inputs.forEach(input => {
                        input.disabled = true;
                        input.classList.add('opacity-60', 'cursor-not-allowed');
                    });
                } else {
                    throw new Error('Errore di invio');
                }

            } catch (error) {
                // Error: reset button and show alert
                btnSpinner.classList.add('hidden');
                btnText.classList.remove('hidden');
                submitBtn.disabled = false;
                alert('Ops! Qualcosa è andato storto. Scrivimi a sophie.just4tour@gmail.com');
            }
        });
    }

    // ==========================================================================
    // Unsplash URL Helper
    // ==========================================================================

    /**
     * Normalize Unsplash URL with correct querystring
     * @param {string} url - Image URL
     * @param {string} querystring - Querystring to use (without ?)
     * @returns {string} Normalized URL
     */
    function unsplashUrl(url, querystring) {
        if (!url || !url.includes('images.unsplash.com')) return url;
        return url.split('?')[0] + '?' + querystring;
    }

    // ==========================================================================
    // Dynamic Destinations Loading
    // ==========================================================================

    /**
     * Fetch and render destinations from local JSON
     */
    async function loadDestinations() {
        const grid = document.getElementById('destinations-grid');
        if (!grid) return;

        try {
            const response = await fetch('assets/data/destinations.json');
            const destinations = await response.json();

            grid.innerHTML = destinations.map(d => {
                const image = unsplashUrl(d.image, 'auto=format&fit=crop&w=1200&q=80');
                const thumb = unsplashUrl(d.image, 'auto=format&fit=crop&w=600&q=70');
                return `
                <div class="destination-card group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer fade-in-element visible"
                    data-image="${image || ''}"
                    data-region="${d.region || ''}"
                    data-name="${d.name || ''}"
                    data-tagline="${d.tagline || ''}"
                    data-description="${d.description || ''}"
                    data-best-time="${d.bestTime || ''}"
                    data-highlights="${d.highlights || ''}"
                    data-experiences="${d.experiences || ''}">
                    <img src="${thumb || ''}" alt="${d.name || ''}" loading="lazy" decoding="async"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-6">
                        <p class="text-secondary text-sm font-medium mb-2">${d.region || ''}</p>
                        <h3 class="font-serif text-2xl text-white mb-2">${d.name || ''}</h3>
                        <p class="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            ${d.tagline || ''}
                        </p>
                    </div>
                    <div class="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                    </div>
                </div>`;
            }).join('');
        } catch (error) {
            console.error('Error loading destinations:', error);
        }
    }

    // ==========================================================================
    // Destination Modal
    // ==========================================================================

    /**
     * Initialize destination modal functionality
     */
    function initDestinationModal() {
        const modal = document.getElementById('destination-modal');
        const modalClose = document.getElementById('modal-close');
        const modalBackdrop = modal?.querySelector('.modal-backdrop');
        const destinationCards = document.querySelectorAll('.destination-card');
        const modalCtaBtn = document.getElementById('modal-cta-btn');

        if (!modal || destinationCards.length === 0) return;

        // Modal elements
        const modalImage = document.getElementById('modal-image');
        const modalRegion = document.getElementById('modal-region');
        const modalName = document.getElementById('modal-name');
        const modalTagline = document.getElementById('modal-tagline');
        const modalDescription = document.getElementById('modal-description');
        const modalBestTime = document.getElementById('modal-best-time');
        const modalHighlights = document.getElementById('modal-highlights');
        const modalExperiences = document.getElementById('modal-experiences');
        const modalCtaName = document.getElementById('modal-cta-name');

        /**
         * Open modal with destination data
         * @param {HTMLElement} card - The destination card clicked
         */
        function openModal(card) {
            // Get data from card attributes
            const data = {
                image: card.dataset.image,
                region: card.dataset.region,
                name: card.dataset.name,
                tagline: card.dataset.tagline,
                description: card.dataset.description,
                bestTime: card.dataset.bestTime,
                highlights: card.dataset.highlights,
                experiences: card.dataset.experiences
            };

            // Populate modal
            modalImage.src = data.image;
            modalImage.alt = data.name;
            modalRegion.textContent = data.region;
            modalName.textContent = data.name;
            modalTagline.textContent = data.tagline;
            modalDescription.textContent = data.description;
            modalBestTime.textContent = data.bestTime;
            modalHighlights.textContent = data.highlights;
            modalExperiences.textContent = data.experiences;
            modalCtaName.textContent = data.name;

            // Show modal
            modal.classList.remove('hidden');
            // Force reflow for animation
            modal.offsetHeight;
            modal.classList.add('open');
            document.body.classList.add('modal-open');

            // Reset scroll position
            const modalScroll = modal.querySelector('.modal-scroll');
            if (modalScroll) {
                modalScroll.scrollTop = 0;
            }
        }

        /**
         * Close modal
         */
        function closeModal() {
            modal.classList.remove('open');
            document.body.classList.remove('modal-open');

            // Wait for animation to complete before hiding
            setTimeout(() => {
                if (!modal.classList.contains('open')) {
                    modal.classList.add('hidden');
                }
            }, 400);
        }

        // Event listeners for opening modal
        destinationCards.forEach(card => {
            card.addEventListener('click', () => openModal(card));

            // Keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(card);
                }
            });
        });

        // Event listeners for closing modal
        modalClose.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });

        // Close modal when clicking CTA button (navigate to contact)
        modalCtaBtn.addEventListener('click', () => {
            closeModal();
        });

        // Prevent modal content clicks from closing
        modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // ==========================================================================
    // Dynamic Brochures Loading
    // ==========================================================================

    /**
     * Fetch and render brochures from local JSON
     */
    async function loadBrochures() {
        const grid = document.getElementById('brochures-grid');
        if (!grid) return;

        try {
            const response = await fetch('assets/data/brochures.json');
            const brochures = await response.json();

            grid.innerHTML = brochures.map(b => {
                const image = unsplashUrl(b.image, 'auto=format&fit=crop&w=800&q=70');
                const pdf = b.pdf ? `assets/brochures/${b.pdf}` : '#';
                return `
                <a href="${pdf}" target="_blank" rel="noopener"
                    class="brochure-card group relative bg-neutral rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 fade-in-element visible">
                    <div class="aspect-[4/3] overflow-hidden">
                        <img src="${image || ''}" alt="${b.destination || ''}"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy" decoding="async">
                        <div class="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-dark/20"></div>
                    </div>
                    <div class="absolute top-4 right-4 w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:bg-primary transition-all duration-300">
                        <svg class="w-5 h-5 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                        </svg>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 p-5">
                        ${b.date ? `<p class="text-secondary text-sm font-medium mb-1">${b.date}</p>` : ''}
                        <h3 class="font-serif text-2xl text-white mb-2 drop-shadow-lg">${b.destination || ''}</h3>
                        <p class="text-white/90 text-sm leading-relaxed drop-shadow">${b.description || ''}</p>
                    </div>
                </a>`;
            }).join('');
        } catch (error) {
            console.error('Error loading brochures:', error);
        }
    }

    // Run initialization when DOM is ready
    async function bootstrap() {
        init();
        await loadDestinations();
        initDestinationModal();
        loadBrochures();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

})();

