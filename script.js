// Toggle mobile menu
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.navbar').classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.navbar').classList.remove('active');
    });
});

// Sample data for demonstration
let products = [];
let brands = [];
let gallery = [];

// Initialize with some sample data if empty
if (localStorage.getItem('products')) {
    products = JSON.parse(localStorage.getItem('products'));
} else {
    // Add a few sample products
    products = [
        {
            id: 1,
            name: "PLC Controller",
            category: "Automation",
            description: "Advanced Programmable Logic Controller for industrial automation systems.",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            name: "Variable Frequency Drive",
            category: "Drives",
            description: "Energy efficient VFD for motor speed control and energy savings.",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80"
        }
    ];
    localStorage.setItem('products', JSON.stringify(products));
}

if (localStorage.getItem('brands')) {
    brands = JSON.parse(localStorage.getItem('brands'));
}

if (localStorage.getItem('gallery')) {
    gallery = JSON.parse(localStorage.getItem('gallery'));
}

// DOM Elements
const productsGrid = document.querySelector('.products-grid');
const featuredGrid = document.querySelector('.featured-grid');
const brandsGrid = document.querySelector('.brands-grid');
const galleryGrid = document.querySelector('.gallery-grid');
const productSearch = document.getElementById('productSearch');
const categoryFilter = document.getElementById('categoryFilter');
const productForm = document.getElementById('productForm');
const brandForm = document.getElementById('brandForm');
const galleryForm = document.getElementById('galleryForm');

// Render Functions
function renderProducts(filteredProducts = products) {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <p>No Products Found</p>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-item">
            <div class="product-img" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
            </div>
        </div>
    `).join('');
}

function renderFeaturedProducts() {
    // Show first 4 products as featured
    const featuredProducts = products.slice(0, 4);
    
    if (featuredProducts.length === 0) {
        featuredGrid.innerHTML = '<p>No featured products available</p>';
        return;
    }
    
    featuredGrid.innerHTML = featuredProducts.map(product => `
        <div class="featured-item">
            <div class="featured-img" style="background-image: url('${product.image}')"></div>
            <div class="featured-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 80)}...</p>
            </div>
        </div>
    `).join('');
}

function renderBrands() {
    if (brands.length === 0) {
        brandsGrid.innerHTML = `
            <div class="no-brands">
                <p>Add New Brand</p>
            </div>
        `;
        return;
    }
    
    brandsGrid.innerHTML = brands.map(brand => `
        <div class="brand-item">
            <div class="brand-img" style="background-image: url('${brand.image}')"></div>
        </div>
    `).join('');
}

function renderGallery() {
    if (gallery.length === 0) {
        galleryGrid.innerHTML = `
            <div class="no-gallery">
                <p>Add Gallery Image</p>
            </div>
        `;
        return;
    }
    
    galleryGrid.innerHTML = gallery.map(item => `
        <div class="gallery-item">
            <div class="gallery-img" style="background-image: url('${item.image}')"></div>
            <div class="gallery-info">
                <h3>${item.title}</h3>
            </div>
        </div>
    `).join('');
}

// Update category filter options
function updateCategoryFilter() {
    const categories = [...new Set(products.map(product => product.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>' + 
        categories.map(category => `<option value="${category}">${category}</option>`).join('');
}

// Filter products based on search and category
function filterProducts() {
    const searchTerm = productSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    let filtered = products;
    
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    renderProducts(filtered);
}

// Form Handlers
productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    renderProducts();
    renderFeaturedProducts();
    updateCategoryFilter();
    
    // Reset form
    productForm.reset();
    
    alert('Product added successfully!');
});

brandForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newBrand = {
        id: brands.length > 0 ? Math.max(...brands.map(b => b.id)) + 1 : 1,
        name: document.getElementById('brandName').value,
        image: document.getElementById('brandImage').value
    };
    
    brands.push(newBrand);
    localStorage.setItem('brands', JSON.stringify(brands));
    
    renderBrands();
    
    // Reset form
    brandForm.reset();
    
    alert('Brand added successfully!');
});

galleryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newGalleryItem = {
        id: gallery.length > 0 ? Math.max(...gallery.map(g => g.id)) + 1 : 1,
        title: document.getElementById('galleryTitle').value,
        image: document.getElementById('galleryImage').value
    };
    
    gallery.push(newGalleryItem);
    localStorage.setItem('gallery', JSON.stringify(gallery));
    
    renderGallery();
    
    // Reset form
    galleryForm.reset();
    
    alert('Gallery image added successfully!');
});

// Event Listeners for filtering
productSearch.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    renderFeaturedProducts();
    renderBrands();
    renderGallery();
    updateCategoryFilter();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add current year to footer
    document.querySelector('.footer p').innerHTML = `&copy; ${new Date().getFullYear()} Shafa Abid Automation BD. All rights reserved.`;
});
