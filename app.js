// Gestion du logo
document.addEventListener('DOMContentLoaded', () => {
    const logoImg = document.getElementById('logoImg');
    if (logoImg) {
        logoImg.onerror = function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="white" font-size="40" opacity="0.3"%3ELOGO%3C/text%3E%3C/svg%3E';
        };
    }

    // Animation des cartes produits (page d'accueil)
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
        
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Animation des sections info
    const infoSections = document.querySelectorAll('.info-section');
    infoSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 150);
    });

    // Animation des liens canal
    const canalLinks = document.querySelectorAll('.canal-link');
    canalLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            link.style.transition = 'all 0.6s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateX(0)';
        }, index * 100);
    });

    // Gestion du formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('.submit-btn');
            btn.textContent = 'Envoyé ✓';
            btn.style.background = 'rgba(0, 255, 0, 0.1)';
            btn.style.borderColor = 'rgba(0, 255, 0, 0.3)';
            
            setTimeout(() => {
                this.reset();
                btn.textContent = 'Envoyer';
                btn.style.background = '';
                btn.style.borderColor = '';
            }, 3000);
        });
    }

    // Effet parallaxe sur le logo au scroll
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const logo = document.querySelector('.logo-overlay');
        const blur = document.querySelector('.blur-background');
        
        if (logo && blur) {
            const speed = 0.5;
            logo.style.transform = `translate(-50%, calc(-50% + ${scrolled * speed}px))`;
            blur.style.transform = `translate(-50%, calc(-50% + ${scrolled * speed}px))`;
            
            // Fade effect
            const opacity = Math.max(0.05, 0.08 - (scrolled * 0.0001));
            logo.style.opacity = opacity;
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);

    // Navigation active basée sur l'URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Effet de hover sur les éléments interactifs
    const interactiveElements = document.querySelectorAll('input, textarea, button, .canal-link');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});