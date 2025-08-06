// Charger les paramètres du site
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/site-settings');
        if (response.ok) {
            const settings = await response.json();
            
            // Appliquer le titre ou le logo
            if (settings.useTextTitle && settings.title) {
                // Utiliser le titre texte
                updateTitleDisplay(settings.title, true);
            } else if (!settings.useTextTitle && settings.logoUrl) {
                // Utiliser le logo
                updateLogoDisplay(settings.logoUrl);
            }
        }
    } catch (error) {
        console.log('Utilisation des paramètres par défaut');
    }
});

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