// Animation simple pour les cartes produits
document.addEventListener('DOMContentLoaded', () => {
    // Gestion des cartes produits
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach((card, index) => {
        // Animation d'apparition
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
        
        // Effet au clic
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Gestion du logo
    const logoImg = document.getElementById('logoImg');
    if (logoImg) {
        logoImg.onerror = function() {
            // Placeholder si pas de logo
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="white" font-size="40" opacity="0.3"%3ELOGO%3C/text%3E%3C/svg%3E';
        };
    }
});