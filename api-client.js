// Client API pour connecter le frontend à MongoDB/Cloudinary
// Ajoutez ce fichier à vos pages HTML

const API_URL = 'http://localhost:3000/api'; // Changez avec votre URL de production

// Classe pour gérer les appels API
class ShopAPI {
    // Récupérer tous les produits
    static async getAllProducts() {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des produits');
            return await response.json();
        } catch (error) {
            console.error('Erreur:', error);
            return [];
        }
    }

    // Récupérer un produit par ID
    static async getProduct(productId) {
        try {
            const response = await fetch(`${API_URL}/products/${productId}`);
            if (!response.ok) throw new Error('Produit non trouvé');
            return await response.json();
        } catch (error) {
            console.error('Erreur:', error);
            return null;
        }
    }

    // Charger les produits sur la page d'accueil
    static async loadHomeProducts() {
        const products = await this.getAllProducts();
        const grid = document.querySelector('.products-grid');
        
        if (!grid) return;
        
        grid.innerHTML = '';
        
        products.forEach(product => {
            const card = document.createElement('a');
            card.href = `product-detail.html?id=${product._id}`;
            card.className = 'product-card';
            
            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.imageUrl || 'https://via.placeholder.com/400x250'}" alt="${product.title}">
                    ${product.badges ? product.badges.map(badge => 
                        `<div class="product-badge">${badge}</div>`
                    ).join('') : ''}
                </div>
                <div class="product-info">
                    <h2 class="product-title">${product.title}</h2>
                    <p class="product-subtitle">${product.subtitle || 'Plusieurs variétés'}</p>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }

    // Charger les détails d'un produit
    static async loadProductDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) return;
        
        const product = await this.getProduct(productId);
        
        if (!product) {
            window.location.href = 'index.html';
            return;
        }
        
        // Mettre à jour le titre
        document.querySelector('.detail-title').textContent = product.title;
        document.title = `${product.title} - Boutique Premium`;
        
        // Mettre à jour les variantes
        const variantsList = document.querySelector('.variant-list');
        if (variantsList && product.variants) {
            variantsList.innerHTML = product.variants.map(variant => 
                `<li>${variant}</li>`
            ).join('');
        }
        
        // Mettre à jour les badges
        const badgesContainer = document.querySelector('.detail-badges');
        if (badgesContainer && product.badges) {
            badgesContainer.innerHTML = product.badges.map(badge => 
                `<span class="detail-badge">${badge}</span>`
            ).join('');
        }
        
        // Mettre à jour la description
        const description = document.querySelector('.detail-description p');
        if (description && product.description) {
            description.innerHTML = product.description.replace(/\n/g, '<br>');
        }
        
        // Mettre à jour la vidéo
        const video = document.getElementById('productVideo');
        if (video && product.videoUrl) {
            video.src = product.videoUrl;
            video.poster = product.thumbnailUrl || '';
        }
        
        // Mettre à jour les prix
        const priceGrid = document.querySelector('.price-grid');
        if (priceGrid && product.prices) {
            priceGrid.innerHTML = product.prices.map(price => `
                <div class="price-item">
                    <div class="price-quantity">${price.quantity}</div>
                    <div class="price-amount">${price.amount}</div>
                </div>
            `).join('');
        }
        
        // Mettre à jour le lien Telegram
        const orderButton = document.querySelector('.order-button');
        if (orderButton && product.telegramLink) {
            orderButton.href = product.telegramLink;
        }
    }
}

// Initialiser selon la page
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('index.html') || currentPage === '/') {
        ShopAPI.loadHomeProducts();
    } else if (currentPage.includes('product-detail.html')) {
        ShopAPI.loadProductDetail();
    }
});

// Exporter pour utilisation dans d'autres scripts
window.ShopAPI = ShopAPI;