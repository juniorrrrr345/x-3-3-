// État de l'application
let isAuthenticated = false;
let siteSettings = {};
let contactContent = {};
let products = [];

// Éléments DOM
const loginContainer = document.getElementById('loginContainer');
const adminContainer = document.getElementById('adminContainer');
const loginForm = document.getElementById('loginForm');
const siteForm = document.getElementById('siteForm');
const contactForm = document.getElementById('contactForm');
const productForm = document.getElementById('productForm');
const productModal = document.getElementById('productModal');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');

// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/admin/check');
    const data = await response.json();
    
    if (data.isAdmin) {
        showAdminPanel();
    }

    // Gérer les radio buttons pour le type de titre
    document.getElementById('useTextTitle').addEventListener('change', handleTitleTypeChange);
    document.getElementById('useLogoTitle').addEventListener('change', handleTitleTypeChange);
    
    // Gérer l'aperçu en temps réel
    document.getElementById('siteTitle').addEventListener('input', updatePreview);
    document.getElementById('logoUrl').addEventListener('input', updatePreview);
});

// Gestion de la connexion
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAdminPanel();
        } else {
            showError(data.error || 'Erreur de connexion');
        }
    } catch (error) {
        showError('Erreur de connexion au serveur');
    }
});

// Afficher le panel admin
function showAdminPanel() {
    isAuthenticated = true;
    loginContainer.style.display = 'none';
    adminContainer.style.display = 'block';
    loadSiteSettings();
    loadContactContent();
    loadProducts();
}

// Déconnexion
async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
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
    }
}

// Gérer le changement de type de titre
function handleTitleTypeChange() {
    const useText = document.getElementById('useTextTitle').checked;
    document.getElementById('textTitleSection').style.display = useText ? 'block' : 'none';
    document.getElementById('logoSection').style.display = useText ? 'none' : 'block';
    updatePreview();
}

// Mettre à jour l'aperçu
function updatePreview() {
    const previewContent = document.getElementById('previewContent');
    const useText = document.getElementById('useTextTitle').checked;
    
    if (useText) {
        const title = document.getElementById('siteTitle').value || 'Boutique Premium';
        previewContent.innerHTML = `
            <h2 style="color: #1d1d1f; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                ${title}
            </h2>
        `;
    } else {
        const logoUrl = document.getElementById('logoUrl').value;
        if (logoUrl) {
            previewContent.innerHTML = `
                <img src="${logoUrl}" alt="Logo" class="preview-logo" style="max-width: 200px; max-height: 100px;">
            `;
        } else {
            previewContent.innerHTML = '<p style="color: #6e6e73;">Entrez une URL pour voir l\'aperçu</p>';
        }
    }
}

// Charger les paramètres du site
async function loadSiteSettings() {
    try {
        const response = await fetch('/api/site-settings');
        siteSettings = await response.json();
        
        // Remplir le formulaire
        if (siteSettings.useTextTitle) {
            document.getElementById('useTextTitle').checked = true;
            document.getElementById('useLogoTitle').checked = false;
        } else {
            document.getElementById('useTextTitle').checked = false;
            document.getElementById('useLogoTitle').checked = true;
        }
        
        document.getElementById('siteTitle').value = siteSettings.title || '';
        document.getElementById('logoUrl').value = siteSettings.logoUrl || '';
        
        handleTitleTypeChange();
        updatePreview();
    } catch (error) {
        showError('Erreur lors du chargement des paramètres');
    }
}

// Sauvegarder les paramètres du site
siteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const useTextTitle = document.getElementById('useTextTitle').checked;
    const updatedSettings = {
        title: document.getElementById('siteTitle').value,
        logoUrl: document.getElementById('logoUrl').value,
        useTextTitle: useTextTitle
    };
    
    try {
        const response = await fetch('/api/admin/site-settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSettings)
        });
        
        if (response.ok) {
            showSuccess('Paramètres mis à jour avec succès');
        } else {
            showError('Erreur lors de la mise à jour');
        }
    } catch (error) {
        showError('Erreur de connexion au serveur');
    }
});

// Charger le contenu de la page contact
async function loadContactContent() {
    try {
        const response = await fetch('/api/contact-content');
        contactContent = await response.json();
        
        // Remplir le formulaire
        document.getElementById('contactTitle').value = contactContent.title || '';
        document.getElementById('contactMainText').value = contactContent.mainText || '';
        document.getElementById('contactEmail').value = contactContent.email || '';
        document.getElementById('contactResponseTime').value = contactContent.responseTime || '';
        document.getElementById('contactAdditionalInfo').value = contactContent.additionalInfo || '';
    } catch (error) {
        showError('Erreur lors du chargement du contenu');
    }
}

// Sauvegarder le contenu de la page contact
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const updatedContent = {
        title: document.getElementById('contactTitle').value,
        mainText: document.getElementById('contactMainText').value,
        email: document.getElementById('contactEmail').value,
        responseTime: document.getElementById('contactResponseTime').value,
        additionalInfo: document.getElementById('contactAdditionalInfo').value
    };
    
    try {
        const response = await fetch('/api/admin/contact-content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedContent)
        });
        
        if (response.ok) {
            showSuccess('Contenu mis à jour avec succès');
        } else {
            showError('Erreur lors de la mise à jour');
        }
    } catch (error) {
        showError('Erreur de connexion au serveur');
    }
});

// Charger les produits
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        displayProducts();
    } catch (error) {
        showError('Erreur lors du chargement des produits');
    }
}

// Afficher les produits
function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    
    if (products.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; color: #6e6e73;">Aucun produit pour le moment</p>';
        return;
    }
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x300?text=Image'">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${product.price}€</p>
            <p style="font-size: 14px; color: #6e6e73;">${product.category}</p>
            <div class="product-actions">
                <button class="btn-small btn-edit" onclick="editProduct('${product.id}')">Modifier</button>
                <button class="btn-small btn-delete" onclick="deleteProduct('${product.id}')">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// Ouvrir le modal produit
function openProductModal(productId = null) {
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        modalTitle.textContent = 'Modifier le produit';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productCategory').value = product.category;
    } else {
        modalTitle.textContent = 'Ajouter un produit';
        form.reset();
        document.getElementById('productId').value = '';
    }
    
    productModal.style.display = 'flex';
}

// Fermer le modal produit
function closeProductModal() {
    productModal.style.display = 'none';
}

// Modifier un produit
function editProduct(productId) {
    openProductModal(productId);
}

// Supprimer un produit
async function deleteProduct(productId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showSuccess('Produit supprimé avec succès');
            loadProducts();
        } else {
            showError('Erreur lors de la suppression');
        }
    } catch (error) {
        showError('Erreur de connexion au serveur');
    }
}

// Sauvegarder un produit
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value
    };
    
    try {
        const url = productId 
            ? `/api/admin/products/${productId}`
            : '/api/admin/products';
        
        const method = productId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            showSuccess(productId ? 'Produit modifié avec succès' : 'Produit ajouté avec succès');
            closeProductModal();
            loadProducts();
        } else {
            showError('Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        showError('Erreur de connexion au serveur');
    }
});

// Afficher un message de succès
function showSuccess(message) {
    successAlert.textContent = message;
    successAlert.style.display = 'block';
    setTimeout(() => {
        successAlert.style.display = 'none';
    }, 3000);
}

// Afficher un message d'erreur
function showError(message) {
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
    setTimeout(() => {
        errorAlert.style.display = 'none';
    }, 3000);
}

// Fermer le modal en cliquant à l'extérieur
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        closeProductModal();
    }
});