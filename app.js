// Créer des particules animées
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particlesContainer.appendChild(particle);
    }
}

// Mise à jour de l'heure
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('time').textContent = `${hours}:${minutes}`;
}

// Animation du logo au scroll avec effet de parallaxe amélioré
function initScrollEffects() {
    const logoContainer = document.querySelector('.logo-container');
    const glassBlur = document.querySelector('.glass-blur');
    const lightEffect = document.querySelector('.light-effect');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollSpeed = 0.5;
        
        // Parallaxe du logo
        logoContainer.style.transform = `translate(-50%, calc(-50% - ${scrollTop * scrollSpeed}px))`;
        glassBlur.style.transform = `translate(-50%, calc(-50% - ${scrollTop * scrollSpeed}px))`;
        
        // Effet de fade basé sur le scroll
        const opacity = Math.max(0.05, 0.3 - (scrollTop * 0.001));
        logoContainer.style.opacity = opacity;
        
        // Déplacement de l'effet de lumière
        const lightX = 100 + Math.sin(scrollTop * 0.01) * 50;
        const lightY = 100 + scrollTop * 0.3;
        lightEffect.style.transform = `translate(${lightX}px, ${lightY}px)`;
    });
}

// Effet de survol amélioré sur les cartes
function initCardEffects() {
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.addEventListener('mouseenter', function(e) {
            // Créer un effet de lumière qui suit la souris
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.background = `
                radial-gradient(circle at ${x}px ${y}px, 
                    rgba(255, 105, 180, 0.1) 0%, 
                    rgba(255, 255, 255, 0.03) 40%,
                    rgba(255, 255, 255, 0.03) 100%)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.03)';
        });
        
        card.addEventListener('click', function() {
            // Animation de clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Animation d'apparition en cascade
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.8s ease forwards';
    });
}

// Navigation interactive
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelector('.nav-item.active').classList.remove('active');
            this.classList.add('active');
            
            // Effet de ripple
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(255, 105, 180, 0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Gestion des boutons du header
function initHeaderButtons() {
    const backBtn = document.querySelector('.back-btn');
    const menuBtn = document.querySelector('.menu-btn');
    
    backBtn.addEventListener('click', () => {
        // Animation de fermeture
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(0.95)';
        setTimeout(() => {
            // Dans une vraie app, ceci fermerait la mini-app
            console.log('Fermeture de l\'application');
        }, 300);
    });
    
    menuBtn.addEventListener('click', () => {
        console.log('Menu ouvert');
        // Ici vous pourriez ouvrir un menu latéral
    });
}

// Effet de mouvement sur la souris (desktop)
function initMouseEffects() {
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const lightEffect = document.querySelector('.light-effect');
            if (lightEffect) {
                const offsetX = mouseX * 100 - 50;
                const offsetY = mouseY * 100 - 50;
                lightEffect.style.transform = `translate(${200 + offsetX}px, ${200 + offsetY}px)`;
            }
        });
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    updateTime();
    initScrollEffects();
    initCardEffects();
    initNavigation();
    initHeaderButtons();
    initMouseEffects();
    
    // Mise à jour de l'heure toutes les minutes
    setInterval(updateTime, 60000);
});

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    // Recréer les particules si la fenêtre est redimensionnée
    const particlesContainer = document.getElementById('particles');
    particlesContainer.innerHTML = '';
    createParticles();
});