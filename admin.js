// Variables globales
let isAuthenticated = false;
let allSettings = {};
let canalNetworks = [];
let currentEditingProduct = null;

// Vérifier l'authentification au chargement
window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/auth/check');
    const data = await response.json();
    
    if (data.authenticated) {
        showAdminPanel();
    } else {
        showLoginForm();
    }
});

// Afficher le formulaire de connexion
function showLoginForm() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminContainer').style.display = 'none';
}

// Afficher le panel admin
function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'block';
    isAuthenticated = true;
    loadAllSettings();
    loadProducts();
}

// Gérer la connexion
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAdminPanel();
        } else {
            showError('Mot de passe incorrect');
        }
    } catch (error) {
        showError('Erreur de connexion');
    }
});

// Déconnexion
async function logout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        showLoginForm();
        document.getElementById('password').value = '';
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
    }
}

// Afficher les messages
function showSuccess(message) {
    const alert = document.getElementById('successAlert');
    alert.textContent = message;
    alert.style.display = 'block';
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

function showError(message) {
    const alert = document.getElementById('errorAlert');
    alert.textContent = message;
    alert.style.display = 'block';
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

// Changer d'onglet
function switchTab(tabName) {
    // Mettre à jour les onglets
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Mettre à jour le contenu
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Charger les données si nécessaire
    if (tabName === 'products') {
        loadProducts();
    } else if (tabName === 'canal') {
        loadCanalNetworks();
    } else if (tabName === 'info') {
        loadInfoContent();
    }
}

// Gérer le changement de type de titre
document.getElementById('useTextTitle').addEventListener('change', handleTitleTypeChange);
document.getElementById('useLogoTitle').addEventListener('change', handleTitleTypeChange);

function handleTitleTypeChange() {
    const useText = document.getElementById('useTextTitle').checked;
    document.getElementById('textTitleSection').style.display = useText ? 'block' : 'none';
    document.getElementById('logoSection').style.display = useText ? 'none' : 'block';
}

// Gérer le changement de type de fond
document.getElementById('useImageBg').addEventListener('change', handleBackgroundTypeChange);
document.getElementById('useColorBg').addEventListener('change', handleBackgroundTypeChange);

function handleBackgroundTypeChange() {
    const useImage = document.getElementById('useImageBg').checked;
    document.getElementById('imageBgSection').style.display = useImage ? 'block' : 'none';
    document.getElementById('colorBgSection').style.display = useImage ? 'none' : 'block';
}

// Prévisualiser le logo
document.getElementById('logoUrl').addEventListener('input', (e) => {
    const url = e.target.value;
    if (url) {
        document.getElementById('logoPreview').style.display = 'block';
        document.getElementById('logoPreviewImg').src = url;
    } else {
        document.getElementById('logoPreview').style.display = 'none';
    }
});

// Charger tous les paramètres
async function loadAllSettings() {
    try {
        const response = await fetch('/api/settings');
        allSettings = await response.json();
        
        // Charger les paramètres du site
        if (allSettings.site) {
            loadSiteSettings(allSettings.site);
        }
        
        // Charger les réseaux sociaux
        if (allSettings.social) {
            loadSocialSettings(allSettings.social);
        }
        
        // Charger le contenu contact
        if (allSettings.contact) {
            loadContactContent(allSettings.contact);
        }
        
        // Charger le bouton commander
        if (allSettings.orderButton) {
            loadOrderButtonSettings(allSettings.orderButton);
        }
    } catch (error) {
        showError('Erreur lors du chargement des paramètres');
    }
}

// Charger les paramètres du site
function loadSiteSettings(siteSettings) {
    if (siteSettings.useTextTitle) {
        document.getElementById('useTextTitle').checked = true;
        document.getElementById('useLogoTitle').checked = false;
    } else {
        document.getElementById('useTextTitle').checked = false;
        document.getElementById('useLogoTitle').checked = true;
    }
    
    document.getElementById('siteTitle').value = siteSettings.title || '';
    document.getElementById('logoUrl').value = siteSettings.logoUrl || '';
    
    if (siteSettings.backgroundType === 'color') {
        document.getElementById('useColorBg').checked = true;
        document.getElementById('useImageBg').checked = false;
    } else {
        document.getElementById('useImageBg').checked = true;
        document.getElementById('useColorBg').checked = false;
    }
    
    document.getElementById('backgroundImage').value = siteSettings.backgroundImage || '';
    document.getElementById('backgroundColor').value = siteSettings.backgroundColor || '#1a1a2e';
    
    handleTitleTypeChange();
    handleBackgroundTypeChange();
    
    // Prévisualiser le logo si présent
    if (siteSettings.logoUrl) {
        document.getElementById('logoPreview').style.display = 'block';
        document.getElementById('logoPreviewImg').src = siteSettings.logoUrl;
    }
}

// Charger les paramètres des réseaux sociaux
function loadSocialSettings(socialSettings) {
    document.getElementById('instagramLink').value = socialSettings.instagram || '';
    document.getElementById('telegramLink').value = socialSettings.telegram || '';
    document.getElementById('snapchatLink').value = socialSettings.snapchat || '';
}

// Charger le contenu contact
function loadContactContent(contactContent) {
    document.getElementById('contactTitle').value = contactContent.title || '';
    document.getElementById('contactContent').value = contactContent.content || '';
}

// Charger le contenu info
async function loadInfoContent() {
    try {
        const response = await fetch('/api/info-content');
        const infoContent = await response.json();
        document.getElementById('infoTitle').value = infoContent.title || '';
        document.getElementById('infoContent').value = infoContent.content || '';
    } catch (error) {
        showError('Erreur lors du chargement du contenu info');
    }
}

// Charger les paramètres du bouton commander
function loadOrderButtonSettings(buttonSettings) {
    document.getElementById('orderButtonText').value = buttonSettings.text || '📱 COMMANDER';
    document.getElementById('orderButtonLink').value = buttonSettings.link || '';
    document.getElementById('orderButtonColor').value = buttonSettings.color || '#667eea';
}

// Sauvegarder tous les paramètres du site
async function saveAllSiteSettings() {
    const useTextTitle = document.getElementById('useTextTitle').checked;
    const useImageBg = document.getElementById('useImageBg').checked;
    
    const siteSettings = {
        title: document.getElementById('siteTitle').value,
        logoUrl: document.getElementById('logoUrl').value,
        useTextTitle: useTextTitle,
        backgroundImage: document.getElementById('backgroundImage').value,
        backgroundColor: document.getElementById('backgroundColor').value,
        backgroundType: useImageBg ? 'image' : 'color'
    };
    
    const orderButton = {
        text: document.getElementById('orderButtonText').value,
        link: document.getElementById('orderButtonLink').value,
        color: document.getElementById('orderButtonColor').value
    };
    
    try {
        // Sauvegarder les paramètres du site
        const siteResponse = await fetch('/api/admin/site-settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siteSettings)
        });
        
        // Sauvegarder le bouton commander
        const buttonResponse = await fetch('/api/admin/order-button', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderButton)
        });
        
        if (siteResponse.ok && buttonResponse.ok) {
            showSuccess('Paramètres d\'apparence enregistrés avec succès');
        } else {
            showError('Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        showError('Erreur lors de l\'enregistrement');
    }
}

// Gérer le formulaire des réseaux sociaux
document.getElementById('socialForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const socialData = {
        instagram: document.getElementById('instagramLink').value,
        telegram: document.getElementById('telegramLink').value,
        snapchat: document.getElementById('snapchatLink').value
    };
    
    try {
        const response = await fetch('/api/admin/social-settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(socialData)
        });
        
        if (response.ok) {
            showSuccess('Réseaux sociaux enregistrés avec succès');
        } else {
            showError('Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        showError('Erreur lors de l\'enregistrement');
    }
});

// Gérer le formulaire contact
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const contactData = {
        title: document.getElementById('contactTitle').value,
        content: document.getElementById('contactContent').value
    };
    
    try {
        const response = await fetch('/api/admin/contact-content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        
        if (response.ok) {
            showSuccess('Page contact mise à jour avec succès');
        } else {
            showError('Erreur lors de la mise à jour');
        }
    } catch (error) {
        showError('Erreur lors de la mise à jour');
    }
});

// Gérer le formulaire info
document.getElementById('infoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const infoData = {
        title: document.getElementById('infoTitle').value,
        content: document.getElementById('infoContent').value
    };
    
    try {
        const response = await fetch('/api/admin/info-content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(infoData)
        });
        
        if (response.ok) {
            showSuccess('Page info mise à jour avec succès');
        } else {
            showError('Erreur lors de la mise à jour');
        }
    } catch (error) {
        showError('Erreur lors de la mise à jour');
    }
});

// Gestion des réseaux Canal
async function loadCanalNetworks() {
    try {
        const response = await fetch('/api/canal-networks');
        canalNetworks = await response.json();
        displayCanalNetworks();
    } catch (error) {
        showError('Erreur lors du chargement des réseaux');
    }
}

function displayCanalNetworks() {
    const container = document.getElementById('canalNetworks');
    container.innerHTML = '';
    
    canalNetworks.forEach((network, index) => {
        const networkDiv = document.createElement('div');
        networkDiv.className = 'canal-network-item';
        networkDiv.innerHTML = `
            <input type="text" class="emoji-input" value="${network.emoji || ''}" placeholder="📱" onchange="updateCanalNetwork(${index}, 'emoji', this.value)">
            <input type="text" value="${network.name || ''}" placeholder="Nom du réseau" onchange="updateCanalNetwork(${index}, 'name', this.value)">
            <input type="url" value="${network.link || ''}" placeholder="https://..." onchange="updateCanalNetwork(${index}, 'link', this.value)">
            <button class="remove-btn" onclick="removeCanalNetwork(${index})">Supprimer</button>
        `;
        container.appendChild(networkDiv);
    });
}

function addCanalNetwork() {
    canalNetworks.push({ emoji: '', name: '', link: '' });
    displayCanalNetworks();
}

function updateCanalNetwork(index, field, value) {
    canalNetworks[index][field] = value;
}

function removeCanalNetwork(index) {
    canalNetworks.splice(index, 1);
    displayCanalNetworks();
}

async function saveCanalNetworks() {
    try {
        const response = await fetch('/api/admin/canal-networks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(canalNetworks)
        });
        
        if (response.ok) {
            showSuccess('Réseaux de la page Canal enregistrés');
        } else {
            showError('Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        showError('Erreur lors de l\'enregistrement');
    }
}

// Gestion des produits
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        showError('Erreur lors du chargement des produits');
    }
}

function displayProducts(products) {
    const container = document.getElementById('productsList');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-item';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-actions">
                <button onclick="editProduct('${product._id}')">Modifier</button>
                <button onclick="deleteProduct('${product._id}')">Supprimer</button>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// Modal produit
function showAddProductModal() {
    currentEditingProduct = null;
    document.getElementById('modalTitle').textContent = 'Ajouter un produit';
    document.getElementById('productForm').reset();
    document.getElementById('pricesList').innerHTML = '';
    addPriceRow(); // Ajouter une ligne de prix par défaut
    document.getElementById('productModal').style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Gestion des prix multiples
function addPriceRow() {
    const pricesList = document.getElementById('pricesList');
    const priceRow = document.createElement('div');
    priceRow.className = 'price-row';
    priceRow.innerHTML = `
        <input type="text" placeholder="Quantité (ex: 1 unité, 10ml)" class="quantity-input">
        <input type="text" placeholder="Prix (ex: 29.99€)" class="price-input">
        <button type="button" class="remove-price-btn" onclick="removePriceRow(this)">✕</button>
    `;
    pricesList.appendChild(priceRow);
}

function removePriceRow(button) {
    button.parentElement.remove();
}

// Éditer un produit
async function editProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();
        
        currentEditingProduct = productId;
        document.getElementById('modalTitle').textContent = 'Modifier le produit';
        document.getElementById('productId').value = product._id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productVideo').value = product.video || '';
        
        // Charger les prix
        const pricesList = document.getElementById('pricesList');
        pricesList.innerHTML = '';
        
        if (product.prices && product.prices.length > 0) {
            product.prices.forEach(price => {
                const priceRow = document.createElement('div');
                priceRow.className = 'price-row';
                priceRow.innerHTML = `
                    <input type="text" placeholder="Quantité" class="quantity-input" value="${price.quantity}">
                    <input type="text" placeholder="Prix" class="price-input" value="${price.price}">
                    <button type="button" class="remove-price-btn" onclick="removePriceRow(this)">✕</button>
                `;
                pricesList.appendChild(priceRow);
            });
        } else {
            addPriceRow(); // Ajouter une ligne par défaut
        }
        
        document.getElementById('productModal').style.display = 'block';
    } catch (error) {
        showError('Erreur lors du chargement du produit');
    }
}

// Sauvegarder le produit
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Collecter les prix
    const prices = [];
    document.querySelectorAll('.price-row').forEach(row => {
        const quantity = row.querySelector('.quantity-input').value;
        const price = row.querySelector('.price-input').value;
        if (quantity && price) {
            prices.push({ quantity, price });
        }
    });
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value,
        video: document.getElementById('productVideo').value,
        prices: prices
    };
    
    try {
        const url = currentEditingProduct 
            ? `/api/products/${currentEditingProduct}` 
            : '/api/products';
            
        const method = currentEditingProduct ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            showSuccess(currentEditingProduct ? 'Produit modifié' : 'Produit ajouté');
            closeProductModal();
            loadProducts();
        } else {
            showError('Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        showError('Erreur lors de l\'enregistrement');
    }
});

// Supprimer un produit
async function deleteProduct(productId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showSuccess('Produit supprimé');
            loadProducts();
        } else {
            showError('Erreur lors de la suppression');
        }
    } catch (error) {
        showError('Erreur lors de la suppression');
    }
}

// Fermer la modal en cliquant à l'extérieur
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        closeProductModal();
    }
}