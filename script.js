// ====================
// CONFIGURATION
// ====================
const ADMIN_PASSWORD = "admin123"; // Change this to your secure password
const LOCAL_STORAGE_KEYS = {
    PRODUCTS: 'shafa_products',
    BRANDS: 'shafa_brands',
    GALLERY: 'shafa_gallery',
    ADMIN_LOGGED_IN: 'admin_logged_in'
};

// ====================
// STATE MANAGEMENT
// ====================
let state = {
    isAdminLoggedIn: localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true',
    products: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS)) || [],
    brands: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.BRANDS)) || [],
    gallery: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.GALLERY)) || [],
    editingItem: null,
    editingType: null
};

// ====================
// DOM ELEMENTS
// ====================
const dom = {
    // Admin elements
    adminBtn: document.getElementById('adminBtn'),
    adminLoginModal: document.getElementById('adminLoginModal'),
    closeModal: document.querySelector('.close-modal'),
    loginForm: document.getElementById('loginForm'),
    adminPassword: document.getElementById('adminPassword'),
    
    // Action buttons
    addBrandBtn: document.getElementById('addBrandBtn'),
    addGalleryBtn: document.getElementById('addGalleryBtn'),
    
    // Forms
    adminProductForm: document.getElementById('adminProductForm'),
    adminBrandForm: document.getElementById('adminBrandForm'),
    adminGalleryForm: document.getElementById('adminGalleryForm'),
    
    // Product form
    productForm: document.getElementById('productForm'),
    productId: document.getElementById('productId'),
    productName: document.getElementById('productName'),
    productCategory: document.getElementById('productCategory'),
    productDescription: document.getElementById('productDescription'),
    productImageUpload: document.getElementById('productImageUpload'),
    submitProductBtn: document.getElementById('submitProductBtn'),
    cancelProductBtn: document.getElementById('cancelProductBtn'),
    imagePreview: document.getElementById('imagePreview'),
    
    // Brand form
    brandForm: document.getElementById('brandForm'),
    brandId: document.getElementById('brandId'),
    brandName: document.getElementById('brandName'),
    brandImageUpload: document.getElementById('brandImageUpload'),
    submitBrandBtn: document.getElementById('submitBrandBtn'),
    cancelBrandBtn: document.getElementById('cancelBrandBtn'),
    brandImagePreview: document.getElementById('brandImagePreview'),
    
    // Gallery form
    galleryForm: document.getElementById('galleryForm'),
    galleryId: document.getElementById('galleryId'),
    galleryTitle: document.getElementById('galleryTitle'),
    galleryImageUpload: document.getElementById('galleryImageUpload'),
    submitGalleryBtn: document.getElementById('submitGalleryBtn'),
    cancelGalleryBtn: document.getElementById('cancelGalleryBtn'),
    galleryImagePreview: document.getElementById('galleryImagePreview'),
    
    // Search and filter
    productSearch: document.getElementById('productSearch'),
    categoryFilter: document.getElementById('categoryFilter'),
    
    // Grid containers
    productsGrid: document.querySelector('.products-grid'),
    featuredGrid: document.querySelector('.featured-grid'),
    brandsGrid: document.querySelector('.brands-grid'),
    galleryGrid: document.querySelector('.gallery-grid'),
    
    // Toast
    toast: document.getElementById('toast')
};

// ====================
// UTILITY FUNCTIONS
// ====================
function showToast(message, type = 'success') {
    dom.toast.textContent = message;
    dom.toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        dom.toast.classList.remove('show');
    }, 3000);
}

function saveToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(state.products));
    localStorage.setItem(LOCAL_STORAGE_KEYS.BRANDS, JSON.stringify(state.brands));
    localStorage.setItem(LOCAL_STORAGE_KEYS.GALLERY, JSON.stringify(state.gallery));
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_LOGGED_IN, state.isAdminLoggedIn.toString());
}

function generateId(items) {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function resetForm(formType) {
    switch(formType) {
        case 'product':
            dom.productForm.reset();
            dom.productId.value = '';
            dom.imagePreview.innerHTML = '';
            dom.submitProductBtn.textContent = 'Add Product';
            state.editingItem = null;
            state.editingType = null;
            break;
        case 'brand':
            dom.brandForm.reset();
            dom.brandId.value = '';
            dom.brandImagePreview.innerHTML = '';
            dom.submitBrandBtn.textContent = 'Add Brand';
            state.editingItem = null;
            state.editingType = null;
            break;
        case 'gallery':
            dom.galleryForm.reset();
            dom.galleryId.value = '';
            dom.galleryImagePreview.innerHTML = '';
            dom.submitGalleryBtn.textContent = 'Add Image';
            state.editingItem = null;
            state.editingType = null;
            break;
    }
}

// ====================
// RENDER FUNCTIONS
// ====================
function renderProducts(filteredProducts = state.products) {
    if (filteredProducts.length === 0) {
        dom.productsGrid.innerHTML = `
            <div class="no-products">
                <p>No Products Found</p>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    dom.productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-item">
            <div class="product-img" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                ${state.isAdminLoggedIn ? `
                    <div class="product-actions">
                        <button class="action-btn edit" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function renderFeaturedProducts() {
    const featuredProducts = state.products.slice(0, 4);
    
    if (featuredProducts.length === 0) {
        dom.featuredGrid.innerHTML = '<p class="no-data">No featured products available</p>';
        return;
    }
    
    dom.featuredGrid.innerHTML = featuredProducts.map(product => `
        <div class="featured-item">
            <div class="featured-img" style="background-image: url('${product.image}')"></div>
            <div class="featured-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 100)}...</p>
            </div>
        </div>
    `).join('');
}

function renderBrands() {
    if (state.brands.length === 0) {
        dom.brandsGrid.innerHTML = `
            <div class="no-brands">
                <p>No brands available</p>
                ${state.isAdminLoggedIn ? `<p>Click "Add Brand" to get started</p>` : ''}
            </div>
        `;
        return;
    }
    
    dom.brandsGrid.innerHTML = state.brands.map(brand => `
        <div class="brand-item">
            <img src="${brand.image}" alt="${brand.name}" class="brand-img">
            ${state.isAdminLoggedIn ? `
                <div class="brand-actions">
                    <button class="action-btn edit" onclick="editBrand(${brand.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteBrand(${brand.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function renderGallery() {
    if (state.gallery.length === 0) {
        dom.galleryGrid.innerHTML = `
            <div class="no-gallery">
                <p>No gallery images available</p>
                ${state.isAdminLoggedIn ? `<p>Click "Add Image" to get started</p>` : ''}
            </div>
        `;
        return;
    }
    
    dom.galleryGrid.innerHTML = state.gallery.map(item => `
        <div class="gallery-item">
            <div class="gallery-img" style="background-image: url('${item.image}')"></div>
            <div class="gallery-info">
                <h3>${item.title}</h3>
            </div>
            ${state.isAdminLoggedIn ? `
                <div class="gallery-actions">
                    <button class="action-btn edit" onclick="editGalleryItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteGalleryItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function updateCategoryFilter() {
    const categories = [...new Set(state.products.map(product => product.category))];
    dom.categoryFilter.innerHTML = '<option value="all">All Categories</option>' + 
        categories.map(category => `<option value="${category}">${category}</option>`).join('');
}

function filterProducts() {
    const searchTerm = dom.productSearch.value.toLowerCase();
    const selectedCategory = dom.categoryFilter.value;
    
    let filtered = state.products;
    
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

// ====================
// CRUD OPERATIONS
// ====================
// Product CRUD
async function addProduct(productData) {
    try {
        const newProduct = {
            id: generateId(state.products),
            ...productData,
            createdAt: new Date().toISOString()
        };
        
        state.products.push(newProduct);
        saveToLocalStorage();
        renderProducts();
        renderFeaturedProducts();
        updateCategoryFilter();
        showToast('Product added successfully!');
        return true;
    } catch (error) {
        showToast('Error adding product', 'error');
        return false;
    }
}

async function updateProduct(id, productData) {
    try {
        const index = state.products.findIndex(p => p.id === id);
        if (index === -1) return false;
        
        state.products[index] = {
            ...state.products[index],
            ...productData,
            updatedAt: new Date().toISOString()
        };
        
        saveToLocalStorage();
        renderProducts();
        renderFeaturedProducts();
        updateCategoryFilter();
        showToast('Product updated successfully!');
        return true;
    } catch (error) {
        showToast('Error updating product', 'error');
        return false;
    }
}

function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    state.products = state.products.filter(p => p.id !== id);
    saveToLocalStorage();
    renderProducts();
    renderFeaturedProducts();
    updateCategoryFilter();
    showToast('Product deleted successfully!');
}

function editProduct(id) {
    const product = state.products.find(p => p.id === id);
    if (!product) return;
    
    state.editingItem = product;
    state.editingType = 'product';
    
    dom.productId.value = product.id;
    dom.productName.value = product.name;
    dom.productCategory.value = product.category;
    dom.productDescription.value = product.description;
    dom.imagePreview.innerHTML = `
        <img src="${product.image}" alt="Preview" class="preview-image">
    `;
    dom.submitProductBtn.textContent = 'Update Product';
    
    dom.adminProductForm.style.display = 'block';
    dom.adminProductForm.scrollIntoView({ behavior: 'smooth' });
}

// Brand CRUD
async function addBrand(brandData) {
    try {
        const newBrand = {
            id: generateId(state.brands),
            ...brandData
        };
        
        state.brands.push(newBrand);
        saveToLocalStorage();
        renderBrands();
        showToast('Brand added successfully!');
        return true;
    } catch (error) {
        showToast('Error adding brand', 'error');
        return false;
    }
}

async function updateBrand(id, brandData) {
    try {
        const index = state.brands.findIndex(b => b.id === id);
        if (index === -1) return false;
        
        state.brands[index] = { ...state.brands[index], ...brandData };
        saveToLocalStorage();
        renderBrands();
        showToast('Brand updated successfully!');
        return true;
    } catch (error) {
        showToast('Error updating brand', 'error');
        return false;
    }
}

function deleteBrand(id) {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    state.brands = state.brands.filter(b => b.id !== id);
    saveToLocalStorage();
    renderBrands();
    showToast('Brand deleted successfully!');
}

function editBrand(id) {
    const brand = state.brands.find(b => b.id === id);
    if (!brand) return;
    
    state.editingItem = brand;
    state.editingType = 'brand';
    
    dom.brandId.value = brand.id;
    dom.brandName.value = brand.name;
    dom.brandImagePreview.innerHTML = `
        <img src="${brand.image}" alt="Preview" class="preview-image">
    `;
    dom.submitBrandBtn.textContent = 'Update Brand';
    
    dom.adminBrandForm.style.display = 'block';
    dom.adminBrandForm.scrollIntoView({ behavior: 'smooth' });
}

// Gallery CRUD
async function addGalleryItem(galleryData) {
    try {
        const newItem = {
            id: generateId(state.gallery),
            ...galleryData
        };
        
        state.gallery.push(newItem);
        saveToLocalStorage();
        renderGallery();
        showToast('Gallery image added successfully!');
        return true;
    } catch (error) {
        showToast('Error adding gallery image', 'error');
        return false;
    }
}

async function updateGalleryItem(id, galleryData) {
    try {
        const index = state.gallery.findIndex(g => g.id === id);
        if (index === -1) return false;
        
        state.gallery[index] = { ...state.gallery[index], ...galleryData };
        saveToLocalStorage();
        renderGallery();
        showToast('Gallery image updated successfully!');
        return true;
    } catch (error) {
        showToast('Error updating gallery image', 'error');
        return false;
    }
}

function deleteGalleryItem(id) {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;
    
    state.gallery = state.gallery.filter(g => g.id !== id);
    saveToLocalStorage();
    renderGallery();
    showToast('Gallery image deleted successfully!');
}

function editGalleryItem(id) {
    const item = state.gallery.find(g => g.id === id);
    if (!item) return;
    
    state.editingItem = item;
    state.editingType = 'gallery';
    
    dom.galleryId.value = item.id;
    dom.galleryTitle.value = item.title;
    dom.galleryImagePreview.innerHTML = `
        <img src="${item.image}" alt="Preview" class="preview-image">
    `;
    dom.submitGalleryBtn.textContent = 'Update Image';
    
    dom.adminGalleryForm.style.display = 'block';
    dom.adminGalleryForm.scrollIntoView({ behavior: 'smooth' });
}

// ====================
// ADMIN MANAGEMENT
// ====================
function updateAdminUI() {
    const adminButtons = document.querySelectorAll('.admin-action-btn');
    const actionButtons = document.querySelectorAll('.action-btn');
    
    if (state.isAdminLoggedIn) {
        dom.adminBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        adminButtons.forEach(btn => btn.style.display = 'flex');
        actionButtons.forEach(btn => btn.style.display = 'flex');
        
        // Show add product form button in header
        if (!document.querySelector('#addProductBtn')) {
            const addProductBtn = document.createElement('button');
            addProductBtn.id = 'addProductBtn';
            addProductBtn.className = 'admin-action-btn';
            addProductBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
            addProductBtn.onclick = () => {
                resetForm('product');
                dom.adminProductForm.style.display = 'block';
                dom.adminProductForm.scrollIntoView({ behavior: 'smooth' });
            };
            document.querySelector('.section-header').appendChild(addProductBtn);
        }
    } else {
        dom.adminBtn.innerHTML = '<i class="fas fa-user-cog"></i> Admin';
        adminButtons.forEach(btn => btn.style.display = 'none');
        actionButtons.forEach(btn => btn.style.display = 'none');
        
        // Hide admin forms
        dom.adminProductForm.style.display = 'none';
        dom.adminBrandForm.style.display = 'none';
        dom.adminGalleryForm.style.display = 'none';
        
        // Remove add product button
        const addProductBtn = document.querySelector('#addProductBtn');
        if (addProductBtn) addProductBtn.remove();
    }
    
    renderProducts();
    renderBrands();
    renderGallery();
}

function loginAdmin(password) {
    if (password === ADMIN_PASSWORD) {
        state.isAdminLoggedIn = true;
        saveToLocalStorage();
        updateAdminUI();
        dom.adminLoginModal.style.display = 'none';
        dom.adminPassword.value = '';
        showToast('Admin login successful!');
    } else {
        showToast('Invalid password', 'error');
    }
}

function logoutAdmin() {
    state.isAdminLoggedIn = false;
    saveToLocalStorage();
    updateAdminUI();
    showToast('Logged out successfully');
}

// ====================
// EVENT LISTENERS
// ====================
// Admin login/logout
dom.adminBtn.addEventListener('click', () => {
    if (state.isAdminLoggedIn) {
        logoutAdmin();
    } else {
        dom.adminLoginModal.style.display = 'flex';
    }
});

dom.closeModal.addEventListener('click', () => {
    dom.adminLoginModal.style.display = 'none';
});

dom.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginAdmin(dom.adminPassword.value);
});

// Add buttons
dom.addBrandBtn.addEventListener('click', () => {
    resetForm('brand');
    dom.adminBrandForm.style.display = 'block';
    dom.adminBrandForm.scrollIntoView({ behavior: 'smooth' });
});

dom.addGalleryBtn.addEventListener('click', () => {
    resetForm('gallery');
    dom.adminGalleryForm.style.display = 'block';
    dom.adminGalleryForm.scrollIntoView({ behavior: 'smooth' });
});

// Cancel buttons
dom.cancelProductBtn.addEventListener('click', () => {
    resetForm('product');
    dom.adminProductForm.style.display = 'none';
});

dom.cancelBrandBtn.addEventListener('click', () => {
    resetForm('brand');
    dom.adminBrandForm.style.display = 'none';
});

dom.cancelGalleryBtn.addEventListener('click', () => {
    resetForm('gallery');
    dom.adminGalleryForm.style.display = 'none';
});

// Image upload previews
dom.productImageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    try {
        const base64 = await convertImageToBase64(file);
        dom.imagePreview.innerHTML = `
            <img src="${base64}" alt="Preview" class="preview-image">
        `;
    } catch (error) {
        showToast('Error processing image', 'error');
    }
});

dom.brandImageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    try {
        const base64 = await convertImageToBase64(file);
        dom.brandImagePreview.innerHTML = `
            <img src="${base64}" alt="Preview" class="preview-image">
        `;
    } catch (error) {
        showToast('Error processing image', 'error');
    }
});

dom.galleryImageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    try {
        const base64 = await convertImageToBase64(file);
        dom.galleryImagePreview.innerHTML = `
            <img src="${base64}" alt="Preview" class="preview-image">
        `;
    } catch (error) {
        showToast('Error processing image', 'error');
    }
});

// Form submissions
dom.productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const imageSrc = dom.imagePreview.querySelector('img')?.src;
    if (!imageSrc) {
        showToast('Please upload an image', 'error');
        return;
    }
    
    const productData = {
        name: dom.productName.value,
        category: dom.productCategory.value,
        description: dom.productDescription.value,
        image: imageSrc
    };
    
    const productId = parseInt(dom.productId.value);
    
    if (productId) {
        // Update existing product
        await updateProduct(productId, productData);
    } else {
        // Add new product
        await addProduct(productData);
    }
    
    resetForm('product');
    dom.adminProductForm.style.display = 'none';
});

dom.brandForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const imageSrc = dom.brandImagePreview.querySelector('img')?.src;
    if (!imageSrc) {
        showToast('Please upload a logo', 'error');
        return;
    }
    
    const brandData = {
        name: dom.brandName.value,
        image: imageSrc
    };
    
    const brandId = parseInt(dom.brandId.value);
    
    if (brandId) {
        await updateBrand(brandId, brandData);
    } else {
        await addBrand(brandData);
    }
    
    resetForm('brand');
    dom.adminBrandForm.style.display = 'none';
});

dom.galleryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const imageSrc = dom.galleryImagePreview.querySelector('img')?.src;
    if (!imageSrc) {
        showToast('Please upload an image', 'error');
        return;
    }
    
    const galleryData = {
        title: dom.galleryTitle.value,
        image: imageSrc
    };
    
    const galleryId = parseInt(dom.galleryId.value);
    
    if (galleryId) {
        await updateGalleryItem(galleryId, galleryData);
    } else {
        await addGalleryItem(galleryData);
    }
    
    resetForm('gallery');
    dom.adminGalleryForm.style.display = 'none';
});

// Search and filter
dom.productSearch.addEventListener('input', filterProducts);
dom.categoryFilter.addEventListener('change', filterProducts);

// ====================
// INITIALIZATION
// ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize with sample data if empty
    if (state.products.length === 0) {
        state.products = [
            {
                id: 1,
                name: "Strategic PLC Controller",
                category: "Automation",
                description: "Advanced Programmable Logic Controller designed for strategic industrial automation systems that reduce operational friction.",
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Premium VFD System",
                category: "Drives",
                description: "Strategic-grade Variable Frequency Drive delivering unmatched energy efficiency and operational clarity.",
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                createdAt: new Date().toISOString()
            }
        ];
        saveToLocalStorage();
    }
    
    if (state.brands.length === 0) {
        state.brands = [
            {
                id: 1,
                name: "Siemens",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siemens_AG_logo.svg/1024px-Siemens_AG_logo.svg.png"
            },
            {
                id: 2,
                name: "ABB",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/ABB_logo.svg/1024px-ABB_logo.svg.png"
            }
        ];
        saveToLocalStorage();
    }
    
    // Render all components
    renderProducts();
    renderFeaturedProducts();
    renderBrands();
    renderGallery();
    updateCategoryFilter();
    updateAdminUI();
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle
    document.querySelector('.menu-toggle').addEventListener('click', function() {
        document.querySelector('.navbar').classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.navbar').classList.remove('active');
        });
    });
    
    // Update footer year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === dom.adminLoginModal) {
            dom.adminLoginModal.style.display = 'none';
        }
    });
});
