// ====================
// CONFIGURATION
// ====================
const ADMIN_PASSWORD = "admin123"; // Change this to your secure password
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const LOCAL_STORAGE_KEYS = {
    PRODUCTS: 'shafa_products',
    BRANDS: 'shafa_brands',
    GALLERY: 'shafa_gallery',
    COMPANY_INFO: 'shafa_company_info',
    ADMIN_LOGGED_IN: 'admin_logged_in',
    COMPANY_LOGO: 'shafa_company_logo',
    HERO_COVER: 'shafa_hero_cover'
};

// ====================
// STATE MANAGEMENT
// ====================
let state = {
    isAdminLoggedIn: localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true',
    products: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS)) || [],
    brands: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.BRANDS)) || [],
    gallery: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.GALLERY)) || [],
    companyInfo: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.COMPANY_INFO)) || {
        name: 'Shafa Abid Automation',
        tagline: 'Strategic Industrial Solutions',
        description: 'Strategic-grade automation solutions delivering unmatched value',
        contact: {
            phone1: '+880 1869-552775',
            phone2: '+880 1406-503242',
            email: 'shafaabidautomation.bd@gmail.com',
            address: 'Shop No: 01, Porir Rasta, Cort Para, Kumira-4314, Sitakunda, Chittagong',
            hours: {
                weekdays: 'Saturday - Thursday: 9:00 AM - 7:00 PM',
                friday: 'Friday: 9:00 AM - 12:00 PM, 3:00 PM - 7:00 PM'
            }
        }
    },
    companyLogo: localStorage.getItem(LOCAL_STORAGE_KEYS.COMPANY_LOGO) || '',
    heroCover: localStorage.getItem(LOCAL_STORAGE_KEYS.HERO_COVER) || '',
    editingItem: null,
    editingType: null
};

// ====================
// DOM ELEMENTS
// ====================
const dom = {
    // Admin elements
    adminBtn: document.getElementById('adminBtn'),
    adminPanelBtn: document.getElementById('adminPanelBtn'),
    adminLoginModal: document.getElementById('adminLoginModal'),
    adminPanelModal: document.getElementById('adminPanelModal'),
    closeModals: document.querySelectorAll('.close-modal'),
    closeModalBtns: document.querySelectorAll('.close-modal-btn'),
    loginForm: document.getElementById('loginForm'),
    adminPassword: document.getElementById('adminPassword'),
    
    // Company Info Elements
    companyLogo: document.getElementById('companyLogo'),
    companyNameHeader: document.getElementById('companyNameHeader'),
    companyTaglineHeader: document.getElementById('companyTaglineHeader'),
    footerLogo: document.getElementById('footerLogo'),
    footerCompanyName: document.getElementById('footerCompanyName'),
    footerTagline: document.getElementById('footerTagline'),
    footerCopyright: document.getElementById('footerCopyright'),
    footerMessage: document.getElementById('footerMessage'),
    
    // Hero Section
    heroBackground: document.getElementById('heroBackground'),
    heroTitle: document.getElementById('heroTitle'),
    heroDescription: document.getElementById('heroDescription'),
    editCoverBtn: document.getElementById('editCoverBtn'),
    
    // Action buttons
    addProductBtn: document.getElementById('addProductBtn'),
    addBrandBtn: document.getElementById('addBrandBtn'),
    addGalleryBtn: document.getElementById('addGalleryBtn'),
    addFeaturedBtn: document.getElementById('addFeaturedBtn'),
    editAboutBtn: document.getElementById('editAboutBtn'),
    editContactBtn: document.getElementById('editContactBtn'),
    
    // Modals
    productFormModal: document.getElementById('productFormModal'),
    brandFormModal: document.getElementById('brandFormModal'),
    galleryFormModal: document.getElementById('galleryFormModal'),
    
    // Product form
    productForm: document.getElementById('productForm'),
    productFormTitle: document.getElementById('productFormTitle'),
    productId: document.getElementById('productId'),
    productName: document.getElementById('productName'),
    productCategory: document.getElementById('productCategory'),
    productDescription: document.getElementById('productDescription'),
    productImageUpload: document.getElementById('productImageUpload'),
    productImagePreview: document.getElementById('productImagePreview'),
    
    // Brand form
    brandForm: document.getElementById('brandForm'),
    brandFormTitle: document.getElementById('brandFormTitle'),
    brandId: document.getElementById('brandId'),
    brandName: document.getElementById('brandName'),
    brandImageUpload: document.getElementById('brandImageUpload'),
    brandImagePreview: document.getElementById('brandImagePreview'),
    
    // Gallery form
    galleryForm: document.getElementById('galleryForm'),
    galleryFormTitle: document.getElementById('galleryFormTitle'),
    galleryId: document.getElementById('galleryId'),
    galleryTitle: document.getElementById('galleryTitle'),
    galleryImageUpload: document.getElementById('galleryImageUpload'),
    galleryImagePreview: document.getElementById('galleryImagePreview'),
    
    // Admin Panel Forms
    logoForm: document.getElementById('logoForm'),
    logoUpload: document.getElementById('logoUpload'),
    logoImagePreview: document.getElementById('logoImagePreview'),
    currentLogoPreview: document.getElementById('currentLogoPreview'),
    
    coverForm: document.getElementById('coverForm'),
    coverUpload: document.getElementById('coverUpload'),
    coverImagePreview: document.getElementById('coverImagePreview'),
    currentCoverPreview: document.getElementById('currentCoverPreview'),
    
    companyInfoForm: document.getElementById('companyInfoForm'),
    companyName: document.getElementById('companyName'),
    companyTagline: document.getElementById('companyTagline'),
    companyDescription: document.getElementById('companyDescription'),
    
    // Data Management
    exportDataBtn: document.getElementById('exportDataBtn'),
    importDataBtn: document.getElementById('importDataBtn'),
    resetDataBtn: document.getElementById('resetDataBtn'),
    importFile: document.getElementById('importFile'),
    
    // Search and filter
    productSearch: document.getElementById('productSearch'),
    categoryFilter: document.getElementById('categoryFilter'),
    
    // Grid containers
    productsGrid: document.querySelector('.products-grid'),
    featuredGrid: document.querySelector('.featured-grid'),
    brandsGrid: document.querySelector('.brands-grid'),
    galleryGrid: document.querySelector('.gallery-grid'),
    aboutContent: document.querySelector('.about-content'),
    contactInfo: document.querySelector('.contact-info'),
    
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
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPANY_INFO, JSON.stringify(state.companyInfo));
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPANY_LOGO, state.companyLogo);
    localStorage.setItem(LOCAL_STORAGE_KEYS.HERO_COVER, state.heroCover);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_LOGGED_IN, state.isAdminLoggedIn.toString());
}

function generateId(items) {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        if (file.size > MAX_IMAGE_SIZE) {
            reject(new Error(`Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`));
            return;
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function resetForm(formType) {
    switch(formType) {
        case 'product':
            dom.productForm.reset();
            dom.productId.value = '';
            dom.productImagePreview.innerHTML = '';
            dom.productFormTitle.innerHTML = '<i class="fas fa-box"></i> Add New Product';
            state.editingItem = null;
            state.editingType = null;
            break;
        case 'brand':
            dom.brandForm.reset();
            dom.brandId.value = '';
            dom.brandImagePreview.innerHTML = '';
            dom.brandFormTitle.innerHTML = '<i class="fas fa-tag"></i> Add New Brand';
            state.editingItem = null;
            state.editingType = null;
            break;
        case 'gallery':
            dom.galleryForm.reset();
            dom.galleryId.value = '';
            dom.galleryImagePreview.innerHTML = '';
            dom.galleryFormTitle.innerHTML = '<i class="fas fa-image"></i> Add Gallery Image';
            state.editingItem = null;
            state.editingType = null;
            break;
        case 'logo':
            dom.logoForm.reset();
            dom.logoImagePreview.innerHTML = '';
            break;
        case 'cover':
            dom.coverForm.reset();
            dom.coverImagePreview.innerHTML = '';
            break;
        case 'companyInfo':
            dom.companyInfoForm.reset();
            break;
    }
}

// ====================
// IMAGE MANAGEMENT
// ====================
async function handleImageUpload(fileInput, previewElement) {
    const file = fileInput.files[0];
    if (!file) return null;
    
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return null;
    }
    
    try {
        const base64 = await convertImageToBase64(file);
        previewElement.innerHTML = `
            <img src="${base64}" alt="Preview" class="preview-image">
        `;
        return base64;
    } catch (error) {
        showToast(error.message, 'error');
        return null;
    }
}

function updateCompanyLogo(logoData) {
    state.companyLogo = logoData;
    saveToLocalStorage();
    
    // Update all logo instances
    if (state.companyLogo) {
        dom.companyLogo.src = state.companyLogo;
        dom.footerLogo.src = state.companyLogo;
        dom.currentLogoPreview.src = state.companyLogo;
    }
    
    showToast('Company logo updated successfully!');
}

function updateHeroCover(coverData) {
    state.heroCover = coverData;
    saveToLocalStorage();
    
    // Update hero background
    if (state.heroCover) {
        dom.heroBackground.style.backgroundImage = `url('${state.heroCover}')`;
        dom.currentCoverPreview.style.backgroundImage = `url('${state.heroCover}')`;
    }
    
    showToast('Cover image updated successfully!');
}

// ====================
// RENDER FUNCTIONS
// ====================
function renderCompanyInfo() {
    // Update header
    dom.companyNameHeader.textContent = state.companyInfo.name;
    dom.companyTaglineHeader.textContent = state.companyInfo.tagline;
    
    // Update footer
    dom.footerCompanyName.textContent = state.companyInfo.name;
    dom.footerTagline.textContent = state.companyInfo.tagline;
    dom.footerCopyright.textContent = state.companyInfo.name + ' BD';
    dom.footerMessage.textContent = state.companyInfo.description;
    
    // Update forms
    dom.companyName.value = state.companyInfo.name;
    dom.companyTagline.value = state.companyInfo.tagline;
    dom.companyDescription.value = state.companyInfo.description;
    
    // Update hero
    dom.heroTitle.textContent = state.companyInfo.name;
    dom.heroDescription.textContent = state.companyInfo.description;
    
    // Update logos
    if (state.companyLogo) {
        dom.companyLogo.src = state.companyLogo;
        dom.footerLogo.src = state.companyLogo;
        dom.currentLogoPreview.src = state.companyLogo;
    }
    
    // Update hero cover
    if (state.heroCover) {
        dom.heroBackground.style.backgroundImage = `url('${state.heroCover}')`;
        dom.currentCoverPreview.style.backgroundImage = `url('${state.heroCover}')`;
    }
}

function renderAboutSection() {
    dom.aboutContent.innerHTML = `
        <div class="about-item">
            <div class="about-icon">
                <i class="fas fa-chess-king"></i>
            </div>
            <h3>Strategic Vision</h3>
            <p>Established with a clear mission to reduce operational friction and strengthen industrial positioning</p>
        </div>
        <div class="about-item">
            <div class="about-icon">
                <i class="fas fa-network-wired"></i>
            </div>
            <h3>Comprehensive Coverage</h3>
            <p>Delivering precision automation across all 64 districts of Bangladesh</p>
        </div>
        <div class="about-item">
            <div class="about-icon">
                <i class="fas fa-box-open"></i>
            </div>
            <h3>Extensive Portfolio</h3>
            <p>100+ product series with 10,000+ specifications for complete industrial needs</p>
        </div>
        <div class="about-item">
            <div class="about-icon">
                <i class="fas fa-bullseye"></i>
            </div>
            <h3>Strategic Alignment</h3>
            <p>Solutions chosen not for availability, but for alignment with long-term industrial strategy</p>
        </div>
    `;
}

function renderContactSection() {
    dom.contactInfo.innerHTML = `
        <div class="contact-item">
            <div class="contact-icon">
                <i class="fas fa-chess-king"></i>
            </div>
            <h3>Strategic Vision</h3>
            <p>${state.companyInfo.description}</p>
        </div>
        <div class="contact-item">
            <div class="contact-icon">
                <i class="fas fa-user-tie"></i>
            </div>
            <h3>Leadership</h3>
            <p><strong>Md. Mostafa Shahid</strong><br>Founder & Strategic Director</p>
        </div>
        <div class="contact-item">
            <div class="contact-icon">
                <i class="fas fa-phone"></i>
            </div>
            <h3>Direct Contact</h3>
            <p>${state.companyInfo.contact.phone1}</p>
            <p>${state.companyInfo.contact.phone2}</p>
            <p>${state.companyInfo.contact.email}</p>
        </div>
        <div class="contact-item">
            <div class="contact-icon">
                <i class="fas fa-map-marker-alt"></i>
            </div>
            <h3>Strategic Location</h3>
            <p>${state.companyInfo.contact.address}</p>
        </div>
        <div class="contact-item">
            <div class="contact-icon">
                <i class="fas fa-clock"></i>
            </div>
            <h3>Strategic Hours</h3>
            <p><strong>${state.companyInfo.contact.hours.weekdays.split(':')[0]}:</strong> ${state.companyInfo.contact.hours.weekdays.split(':')[1]}</p>
            <p><strong>${state.companyInfo.contact.hours.friday.split(':')[0]}:</strong> ${state.companyInfo.contact.hours.friday.split(':')[1]}</p>
        </div>
        <div class="contact-item">
            <div class="contact-icon">
                <i class="fas fa-bullseye"></i>
            </div>
            <h3>Strategic Intent</h3>
            <p>By reducing friction across execution and communication, we strengthen positioning, signal intent, and simplify operations.</p>
        </div>
    `;
}

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
    dom.productImagePreview.innerHTML = `
        <img src="${product.image}" alt="Preview" class="preview-image">
    `;
    dom.productFormTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Product';
    
    openModal(dom.productFormModal);
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
    dom.brandFormTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Brand';
    
    openModal(dom.brandFormModal);
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
    dom.galleryFormTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Gallery Image';
    
    openModal(dom.galleryFormModal);
}

// ====================
// ADMIN MANAGEMENT
// ====================
function updateAdminUI() {
    const adminActionButtons = document.querySelectorAll('.admin-action-btn');
    const editButtons = document.querySelectorAll('.edit-cover-btn, #editAboutBtn, #editContactBtn');
    
    if (state.isAdminLoggedIn) {
        // Update admin button to show logout
        dom.adminBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        dom.adminPanelBtn.style.display = 'flex';
        
        // Show all admin action buttons
        adminActionButtons.forEach(btn => btn.style.display = 'flex');
        editButtons.forEach(btn => btn.style.display = 'flex');
        
        // Show edit/delete buttons on items
        document.querySelectorAll('.product-actions, .brand-actions, .gallery-actions')
            .forEach(actions => actions.style.display = 'flex');
            
    } else {
        // Update admin button to show login
        dom.adminBtn.innerHTML = '<i class="fas fa-user-cog"></i> Admin';
        dom.adminPanelBtn.style.display = 'none';
        
        // Hide all admin action buttons
        adminActionButtons.forEach(btn => btn.style.display = 'none');
        editButtons.forEach(btn => btn.style.display = 'none');
        
        // Hide edit/delete buttons on items
        document.querySelectorAll('.product-actions, .brand-actions, .gallery-actions')
            .forEach(actions => actions.style.display = 'none');
    }
    
    // Re-render all content
    renderProducts();
    renderBrands();
    renderGallery();
}

function loginAdmin(password) {
    if (password === ADMIN_PASSWORD) {
        state.isAdminLoggedIn = true;
        saveToLocalStorage();
        updateAdminUI();
        closeModal(dom.adminLoginModal);
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
    closeModal(dom.adminPanelModal);
    showToast('Logged out successfully');
}

// ====================
// DATA EXPORT/IMPORT
// ====================
function exportData() {
    const exportData = {
        products: state.products,
        brands: state.brands,
        gallery: state.gallery,
        companyInfo: state.companyInfo,
        companyLogo: state.companyLogo,
        heroCover: state.heroCover,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `shafa-automation-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Data exported successfully!');
}

function importData(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (!confirm('This will replace all current data. Are you sure?')) return;
            
            // Update state with imported data
            if (importedData.products) state.products = importedData.products;
            if (importedData.brands) state.brands = importedData.brands;
            if (importedData.gallery) state.gallery = importedData.gallery;
            if (importedData.companyInfo) state.companyInfo = importedData.companyInfo;
            if (importedData.companyLogo) state.companyLogo = importedData.companyLogo;
            if (importedData.heroCover) state.heroCover = importedData.heroCover;
            
            saveToLocalStorage();
            
            // Re-render everything
            renderCompanyInfo();
            renderProducts();
            renderFeaturedProducts();
            renderBrands();
            renderGallery();
            renderAboutSection();
            renderContactSection();
            updateCategoryFilter();
            
            showToast('Data imported successfully!');
        } catch (error) {
            showToast('Error importing data. Invalid file format.', 'error');
        }
    };
    reader.readAsText(file);
}

function resetAllData() {
    if (!confirm('This will delete ALL data including products, brands, gallery, and company info. Are you absolutely sure?')) return;
    
    if (!confirm('This action cannot be undone. Type "RESET" to confirm:')) {
        const confirmation = prompt('Type "RESET" to confirm deletion:');
        if (confirmation !== 'RESET') {
            showToast('Data reset cancelled', 'error');
            return;
        }
    }
    
    // Clear all localStorage
    Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    
    // Reset state
    state = {
        isAdminLoggedIn: false,
        products: [],
        brands: [],
        gallery: [],
        companyInfo: {
            name: 'Shafa Abid Automation',
            tagline: 'Strategic Industrial Solutions',
            description: 'Strategic-grade automation solutions delivering unmatched value',
            contact: {
                phone1: '+880 1869-552775',
                phone2: '+880 1406-503242',
                email: 'shafaabidautomation.bd@gmail.com',
                address: 'Shop No: 01, Porir Rasta, Cort Para, Kumira-4314, Sitakunda, Chittagong',
                hours: {
                    weekdays: 'Saturday - Thursday: 9:00 AM - 7:00 PM',
                    friday: 'Friday: 9:00 AM - 12:00 PM, 3:00 PM - 7:00 PM'
                }
            }
        },
        companyLogo: '',
        heroCover: '',
        editingItem: null,
        editingType: null
    };
    
    // Re-initialize
    initializeWebsite();
    showToast('All data has been reset', 'warning');
}

// ====================
// EVENT LISTENERS
// ====================
function setupEventListeners() {
    // Admin login/logout
    dom.adminBtn.addEventListener('click', () => {
        if (state.isAdminLoggedIn) {
            logoutAdmin();
        } else {
            openModal(dom.adminLoginModal);
        }
    });
    
    // Admin panel
    dom.adminPanelBtn.addEventListener('click', () => {
        openModal(dom.adminPanelModal);
    });
    
    // Close modals
    dom.closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    dom.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Login form
    dom.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginAdmin(dom.adminPassword.value);
    });
    
    // Edit cover button
    dom.editCoverBtn.addEventListener('click', () => {
        openModal(dom.adminPanelModal);
    });
    
    // Add buttons
    dom.addProductBtn.addEventListener('click', () => {
        resetForm('product');
        openModal(dom.productFormModal);
    });
    
    dom.addBrandBtn.addEventListener('click', () => {
        resetForm('brand');
        openModal(dom.brandFormModal);
    });
    
    dom.addGalleryBtn.addEventListener('click', () => {
        resetForm('gallery');
        openModal(dom.galleryFormModal);
    });
    
    // Image upload previews
    dom.productImageUpload.addEventListener('change', async () => {
        await handleImageUpload(dom.productImageUpload, dom.productImagePreview);
    });
    
    dom.brandImageUpload.addEventListener('change', async () => {
        await handleImageUpload(dom.brandImageUpload, dom.brandImagePreview);
    });
    
    dom.galleryImageUpload.addEventListener('change', async () => {
        await handleImageUpload(dom.galleryImageUpload, dom.galleryImagePreview);
    });
    
    dom.logoUpload.addEventListener('change', async () => {
        await handleImageUpload(dom.logoUpload, dom.logoImagePreview);
    });
    
    dom.coverUpload.addEventListener('change', async () => {
        await handleImageUpload(dom.coverUpload, dom.coverImagePreview);
    });
    
    // Form submissions
    dom.productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const imageSrc = dom.productImagePreview.querySelector('img')?.src;
        if (!imageSrc) {
            showToast('Please upload a product image', 'error');
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
            await updateProduct(productId, productData);
        } else {
            await addProduct(productData);
        }
        
        resetForm('product');
        closeModal(dom.productFormModal);
    });
    
    dom.brandForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const imageSrc = dom.brandImagePreview.querySelector('img')?.src;
        if (!imageSrc) {
            showToast('Please upload a brand logo', 'error');
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
        closeModal(dom.brandFormModal);
    });
    
    dom.galleryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const imageSrc = dom.galleryImagePreview.querySelector('img')?.src;
        if (!imageSrc) {
            showToast('Please upload a gallery image', 'error');
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
        closeModal(dom.galleryFormModal);
    });
    
    // Admin panel forms
    dom.logoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const imageSrc = dom.logoImagePreview.querySelector('img')?.src;
        if (!imageSrc) {
            showToast('Please upload a logo image', 'error');
            return;
        }
        
        updateCompanyLogo(imageSrc);
        resetForm('logo');
    });
    
    dom.coverForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const imageSrc = dom.coverImagePreview.querySelector('img')?.src;
        if (!imageSrc) {
            showToast('Please upload a cover image', 'error');
            return;
        }
        
        updateHeroCover(imageSrc);
        resetForm('cover');
    });
    
    dom.companyInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        state.companyInfo = {
            ...state.companyInfo,
            name: dom.companyName.value,
            tagline: dom.companyTagline.value,
            description: dom.companyDescription.value
        };
        
        saveToLocalStorage();
        renderCompanyInfo();
        showToast('Company information updated successfully!');
    });
    
    // Data management
    dom.exportDataBtn.addEventListener('click', exportData);
    
    dom.importDataBtn.addEventListener('click', () => {
        dom.importFile.click();
    });
    
    dom.importFile.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            importData(e.target.files[0]);
            e.target.value = ''; // Reset file input
        }
    });
    
    dom.resetDataBtn.addEventListener('click', resetAllData);
    
    // Search and filter
    dom.productSearch.addEventListener('input', filterProducts);
    dom.categoryFilter.addEventListener('change', filterProducts);
    
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
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ====================
// INITIALIZATION
// ====================
function initializeWebsite() {
    // Initialize with sample data if empty
    if (state.products.length === 0) {
        state.products = [
            {
                id: 1,
                name: "Strategic PLC Controller",
                category: "Automation",
                description: "Advanced Programmable Logic Controller designed for strategic industrial automation systems.",
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                createdAt: new Date().toISOString()
            }
        ];
    }
    
    if (state.brands.length === 0) {
        state.brands = [
            {
                id: 1,
                name: "Siemens",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siemens_AG_logo.svg/1024px-Siemens_AG_logo.svg.png"
            }
        ];
    }
    
    // Save initial state
    saveToLocalStorage();
    
    // Render all components
    renderCompanyInfo();
    renderAboutSection();
    renderContactSection();
    renderProducts();
    renderFeaturedProducts();
    renderBrands();
    renderGallery();
    updateCategoryFilter();
    updateAdminUI();
    
    // Update footer year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Setup event listeners
    setupEventListeners();
}

// ====================
// START APPLICATION
// ====================
document.addEventListener('DOMContentLoaded', initializeWebsite);
