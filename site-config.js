// Charger tous les paramètres du site
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/settings');
        if (response.ok) {
            const settings = await response.json();
            
            // Appliquer les paramètres du site
            if (settings.site) {
                applySiteSettings(settings.site);
            }
            
            // Appliquer les réseaux sociaux
            if (settings.social) {
                applySocialSettings(settings.social);
            }
            
            // Appliquer le bouton commander
            if (settings.orderButton) {
                applyOrderButtonSettings(settings.orderButton);
            }
        }
    } catch (error) {
        console.log('Utilisation des paramètres par défaut');
    }
});

// Appliquer les paramètres du site (titre/logo et fond)
function applySiteSettings(siteSettings) {
    // Titre ou logo
    if (siteSettings.useTextTitle && siteSettings.title) {
        updateTitleDisplay(siteSettings.title, true);
    } else if (!siteSettings.useTextTitle && siteSettings.logoUrl) {
        updateLogoDisplay(siteSettings.logoUrl);
    }
    
    // Fond de la boutique
    if (siteSettings.backgroundImage) {
        document.body.style.backgroundImage = `url(${siteSettings.backgroundImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    } else if (siteSettings.backgroundColor) {
        document.body.style.backgroundColor = siteSettings.backgroundColor;
    }
}

// Mettre à jour l'affichage du titre
function updateTitleDisplay(title, isText = true) {
    // Mettre à jour le titre de la page
    document.title = title;
    
    // Créer un élément titre pour le header
    const headerLogo = document.querySelector('.header-logo');
    if (headerLogo && isText) {
        const titleElement = document.createElement('h1');
        titleElement.className = 'site-title';
        titleElement.textContent = title;
        titleElement.style.cssText = `
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        `;
        headerLogo.parentElement.replaceChild(titleElement, headerLogo);
    }
    
    // Mettre à jour le logo overlay avec le titre
    const logoOverlay = document.getElementById('logoImg');
    if (logoOverlay && isText) {
        // Créer un SVG avec le titre
        const svgTitle = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='white' font-size='48' font-weight='bold' opacity='0.3'%3E${encodeURIComponent(title)}%3C/text%3E%3C/svg%3E`;
        logoOverlay.src = svgTitle;
    }
}

// Mettre à jour l'affichage du logo
function updateLogoDisplay(logoUrl) {
    // Mettre à jour le logo du header
    const headerLogo = document.querySelector('.header-logo');
    if (headerLogo) {
        headerLogo.src = logoUrl;
        headerLogo.style.cssText = `
            max-height: 50px;
            width: auto;
            filter: brightness(0) invert(1);
        `;
    }
    
    // Mettre à jour le logo overlay
    const logoOverlay = document.getElementById('logoImg');
    if (logoOverlay) {
        logoOverlay.src = logoUrl;
        logoOverlay.style.cssText = `
            opacity: 0.3;
            max-width: 300px;
            max-height: 300px;
        `;
    }
}

// Appliquer les paramètres des réseaux sociaux
function applySocialSettings(socialSettings) {
    // Créer ou mettre à jour la section des réseaux sociaux
    let socialSection = document.getElementById('socialLinksSection');
    
    if (!socialSection) {
        // Créer la section si elle n'existe pas
        socialSection = document.createElement('div');
        socialSection.id = 'socialLinksSection';
        socialSection.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 100;
        `;
        document.body.appendChild(socialSection);
    }
    
    // Vider la section
    socialSection.innerHTML = '';
    
    // Ajouter les liens sociaux
    const socialIcons = {
        telegram: { icon: '📱', color: '#0088cc' },
        whatsapp: { icon: '💬', color: '#25d366' },
        instagram: { icon: '📷', color: '#e4405f' },
        snapchat: { icon: '👻', color: '#fffc00' }
    };
    
    Object.entries(socialSettings).forEach(([platform, link]) => {
        if (link) {
            const socialLink = document.createElement('a');
            socialLink.href = link;
            socialLink.target = '_blank';
            socialLink.style.cssText = `
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: ${socialIcons[platform]?.color || '#333'};
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                font-size: 24px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                transition: transform 0.3s ease;
            `;
            socialLink.innerHTML = socialIcons[platform]?.icon || '🔗';
            socialLink.onmouseover = () => socialLink.style.transform = 'scale(1.1)';
            socialLink.onmouseout = () => socialLink.style.transform = 'scale(1)';
            
            socialSection.appendChild(socialLink);
        }
    });
}

// Appliquer les paramètres du bouton commander
function applyOrderButtonSettings(buttonSettings) {
    // Trouver tous les boutons commander
    const orderButtons = document.querySelectorAll('.order-button, .commander-btn, [data-order-button]');
    
    orderButtons.forEach(button => {
        if (buttonSettings.text) {
            button.textContent = buttonSettings.text;
        }
        
        if (buttonSettings.link) {
            if (button.tagName === 'A') {
                button.href = buttonSettings.link;
            } else {
                button.onclick = () => window.location.href = buttonSettings.link;
            }
        }
        
        if (buttonSettings.backgroundColor || buttonSettings.textColor) {
            button.style.backgroundColor = buttonSettings.backgroundColor || '#667eea';
            button.style.color = buttonSettings.textColor || '#ffffff';
            button.style.border = 'none';
            button.style.padding = '12px 24px';
            button.style.borderRadius = '8px';
            button.style.fontWeight = '600';
            button.style.cursor = 'pointer';
            button.style.transition = 'all 0.3s ease';
        }
    });
}