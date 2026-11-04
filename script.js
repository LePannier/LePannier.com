document.addEventListener('DOMContentLoaded', () => {
    // Add simple drag functionality to the hero lego blocks
    const blocks = document.querySelectorAll('.lego-block');
    
    blocks.forEach(block => {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        block.addEventListener('mousedown', dragStart);
        
        function dragStart(e) {
            isDragging = true;
            // Stop the CSS animation while dragging
            block.style.animation = 'none';
            block.style.zIndex = 10;
            
            // Calculate initial positions
            const rect = block.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            startX = e.clientX - initialX;
            startY = e.clientY - initialY;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const currentX = e.clientX - startX;
            const currentY = e.clientY - startY;
            
            // Get parent container position to keep it relative
            const parentRect = block.parentElement.getBoundingClientRect();
            const relativeX = currentX - parentRect.left;
            const relativeY = currentY - parentRect.top;
            
            block.style.left = `${relativeX}px`;
            block.style.top = `${relativeY}px`;
            block.style.bottom = 'auto';
            block.style.right = 'auto';
            block.style.transform = 'rotate(0deg) scale(1.05)';
        }

        function dragEnd(e) {
            isDragging = false;
            block.style.zIndex = 1;
            block.style.transform = 'rotate(0deg) scale(1)';
            
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    // Burger menu toggle
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            const isActive = burgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            burgerMenu.setAttribute('aria-expanded', isActive);
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
                burgerMenu.setAttribute('aria-expanded', 'false');
            });
        });
    }
});

// Scroll Reveal Animations
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});
revealElements.forEach(el => revealObserver.observe(el));

// Cookie Consent and Google Analytics
const GA_ID = 'G-YSJEDDSZLC';

function loadGoogleAnalytics() {
    window['ga-disable-' + GA_ID] = false;
    if (window.gaLoaded) return;
    window.gaLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_ID, { 'anonymize_ip': true });
}

// Stop tracking and remove the Google Analytics cookies (_ga, _ga_*)
function disableGoogleAnalytics() {
    window['ga-disable-' + GA_ID] = true;
    const host = location.hostname;
    const domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name === '_ga' || name.startsWith('_ga_')) {
            domains.forEach(domain => {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' +
                    (domain ? '; domain=' + domain : '');
            });
        }
    });
}

function showCookieBanner() {
    if (document.querySelector('.cookie-banner')) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner block-border';
    banner.innerHTML = `
        <p>We use cookies to analyze traffic and improve our website via Google Analytics. For more details, see our <a href="/datenschutz/">Privacy Policy</a>. You can change your choice at any time via "Cookie-Einstellungen" at the bottom of the page.</p>
        <div class="cookie-actions">
            <button class="btn-decline block-border" id="btn-decline-cookies">Decline</button>
            <button class="btn-accept block-border" id="btn-accept-cookies">Accept</button>
        </div>
    `;
    document.body.appendChild(banner);

    // Show banner after a tiny delay for animation
    setTimeout(() => {
        banner.classList.add('show');
    }, 500);

    function closeBanner() {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 400);
    }

    document.getElementById('btn-accept-cookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        loadGoogleAnalytics();
        closeBanner();
    });

    document.getElementById('btn-decline-cookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        disableGoogleAnalytics();
        closeBanner();
    });
}

function initCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
        loadGoogleAnalytics();
    } else if (consent !== 'declined') {
        showCookieBanner();
    }

    // "Cookie-Einstellungen" link: reopen the banner so the choice can be changed
    document.querySelectorAll('.cookie-settings').forEach(button => {
        button.addEventListener('click', () => {
            localStorage.removeItem('cookieConsent');
            disableGoogleAnalytics();
            showCookieBanner();
        });
    });
}

// Run consent check
initCookieConsent();
