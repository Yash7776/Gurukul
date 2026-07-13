document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.site-header');

    /* ---------------------------------------------------------
       Existing behavior: mobile menu toggle
       --------------------------------------------------------- */
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    /* ---------------------------------------------------------
       Existing behavior: smooth anchor scrolling
       --------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    /* ---------------------------------------------------------
       Existing behavior: header background on scroll
       --------------------------------------------------------- */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------
       Enhancement: gentle fade-in-up reveal for content sections
       --------------------------------------------------------- */
    if (!prefersReducedMotion) {
        const revealSelectors = [
            '.hero-content', '.hero-visual',
            '.about-card', '.school-card', '.announcement-card',
            '.info-card', '.contact-card', '.timeline-card',
            '.admission-card', '.gallery-card', '.stat-card',
            '.section-title'
        ];
        const revealEls = document.querySelectorAll(revealSelectors.join(','));

        if ('IntersectionObserver' in window && revealEls.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, (index % 4) * 90);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

            revealEls.forEach(el => {
                el.classList.add('reveal');
                observer.observe(el);
            });
        }
    }

    /* ---------------------------------------------------------
       Enhancement: subtle parallax drift on the hero image
       --------------------------------------------------------- */
    const heroVisual = document.querySelector('.hero-visual img');
    if (heroVisual && !prefersReducedMotion) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const offset = Math.min(window.scrollY * 0.08, 40);
                    heroVisual.style.transform = `translateY(${offset}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ---------------------------------------------------------
       Enhancement: ambient floating leaves + a distant bird,
       purely decorative, added to the DOM (no structural change
       to any page — this is a presentational overlay only).
       --------------------------------------------------------- */
    if (!prefersReducedMotion && !document.getElementById('ambient-layer')) {
        const layer = document.createElement('div');
        layer.id = 'ambient-layer';
        layer.setAttribute('aria-hidden', 'true');

        const leafSVG = `<svg viewBox="0 0 40 40" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2 C34 8 36 24 20 38 C4 24 6 8 20 2 Z" fill="#5C7A52" opacity="0.8"/>
            <path d="M20 4 L20 36" stroke="#3B5233" stroke-width="1"/>
        </svg>`;

        const birdSVG = `<svg viewBox="0 0 60 20" width="42" height="14" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 14 C10 2 14 2 22 12 C30 2 34 2 42 14" fill="none" stroke="#3B2417" stroke-width="2" stroke-linecap="round"/>
        </svg>`;

        const leafCount = window.innerWidth < 640 ? 3 : 5;
        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'amb-leaf';
            leaf.innerHTML = leafSVG;
            const left = 4 + Math.random() * 92;
            const duration = 16 + Math.random() * 12;
            const delay = -(Math.random() * duration);
            leaf.style.left = `${left}vw`;
            leaf.style.animationDuration = `${duration}s`;
            leaf.style.animationDelay = `${delay}s`;
            leaf.style.transform = `scale(${0.7 + Math.random() * 0.6})`;
            layer.appendChild(leaf);
        }

        const bird = document.createElement('div');
        bird.className = 'amb-bird';
        bird.innerHTML = birdSVG;
        bird.style.top = `${6 + Math.random() * 12}vh`;
        bird.style.animationDuration = '38s';
        bird.style.animationDelay = '2s';
        layer.appendChild(bird);

        document.body.appendChild(layer);
    }
});
