// --- Variables globales ---
const API_BASE = 'http://localhost:4000/api/inventory';
let inventoryProducts = [];
let currentProductId = null;

let currentPage = 1;
const itemsPerPage = 215;
let filteredProducts = []; // ← productos que pasan el filtro


// --- Funciones de inicialización con validación de sesión y rol ---
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
        alert('Debes iniciar sesión para acceder al inventario.');
        return window.location.href = 'login.html';
    }

    if (user.rol !== 'administrador') {
        alert('No tienes permisos para acceder al inventario.');
        return window.location.href = 'login.html';
    }

    loadInventory();
    setupEventListeners();
    updateDateTime();
    setInterval(updateDateTime, 60000);
});


function updateDateTime() {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString();
    document.getElementById('current-time').textContent = now.toLocaleTimeString();
}

// --- Funciones de carga y renderizado ---
async function loadInventory() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) throw new Error('Error al cargar inventario');

        inventoryProducts = await response.json();
        renderInventory();
    } catch (error) {
        showError('Error al cargar inventario: ' + error.message);
    } finally {
        showLoading(false);
    }
}

function renderInventory() {
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    const productsToRender = filteredProducts.length ? filteredProducts : inventoryProducts;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = productsToRender.slice(start, end);

    paginated.forEach(product => {
        const row = document.createElement('tr');
        row.dataset.id = product.id_producto;
        row.innerHTML = `
    <td>${product.codigo_barras}</td>
    <td>${product.nombre}</td>
    <td>${product.descripcion || '-'}</td>
    <td>$${Number(product.precio).toFixed(2)}</td>
    <td class="${product.stock <= 5 ? 'low-stock' : ''}">${product.stock}</td>
    <td>${getSupplierName(product.id_proveedor)}</td>
    <td class="action-icons">
        <i class="fas fa-pen-to-square edit-icon" title="Editar" data-id="${product.id_producto}"></i>
        <i class="fas fa-trash delete-icon" title="Eliminar" data-id="${product.id_producto}"></i>
    </td>
`;


        tableBody.appendChild(row);
    });

    renderPagination(productsToRender.length);
}

function renderPagination(totalItems) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('pagination-btn');
        if (i === currentPage) btn.classList.add('active');

        btn.addEventListener('click', () => {
            currentPage = i;
            renderInventory();
        });

        paginationContainer.appendChild(btn);
    }
}


function getSupplierName(id) {
    // You could load this from your API or keep a local map
    const suppliers = {
        1: 'Distribuidora Abarrotes',
        2: 'Alimentos del Norte',
        3: 'Productos Selectos',
        // Add more based on your proveedor table
    };
    return id ? suppliers[id] || `Proveedor ${id}` : '-';
}

// --- Funciones CRUD ---
async function saveProduct() {
    const productData = {
        nombre: document.getElementById('productName').value,
        descripcion: document.getElementById('productDescription').value,
        precio: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        codigo_barras: document.getElementById('productBarcode').value,
        id_proveedor: document.getElementById('productSupplier').value || null,
        estado: document.getElementById('productStatus').value
    };

    try {
        showLoading(true);
        const url = currentProductId ? `${API_BASE}/products/${currentProductId}` : `${API_BASE}/products`;
        const method = currentProductId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al guardar producto');
        }

        closeProductModal();
        loadInventory();
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

async function deleteProduct(id) {
    if (!confirm('¿Está seguro de desactivar este producto?')) return;

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Error al desactivar producto');

        loadInventory();
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// --- Funciones de UI/Modal ---
function openProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');

    if (product) {
        document.getElementById('modalTitle').textContent = 'Editar Producto';
        document.getElementById('productId').value = product.id_producto;
        document.getElementById('productBarcode').value = product.codigo_barras;
        document.getElementById('productName').value = product.nombre;
        document.getElementById('productDescription').value = product.descripcion || '';
        document.getElementById('productPrice').value = product.precio;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productSupplier').value = product.id_proveedor || '';
        document.getElementById('productStatus').value = product.estado;
        currentProductId = product.id_producto;
    } else {
        document.getElementById('modalTitle').textContent = 'Agregar Producto';
        form.reset();
        currentProductId = null;
    }

    modal.style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    document.getElementById('productForm').reset();
    currentProductId = null;
}

// --- Funciones de eventos ---
function setupEventListeners() {
    // Abrir modal para agregar producto
    document.getElementById('addProductBtn').addEventListener('click', () => openProductModal());

    // Exportar inventario a CSV
    document.getElementById('exportInventoryBtn').addEventListener('click', exportInventoryToCSV);

    // Cerrar modal
    document.getElementById('closeModalBtn').addEventListener('click', closeProductModal);
    document.getElementById('cancelProductBtn').addEventListener('click', closeProductModal);

    // Guardar producto
    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveProduct();
    });

    // Delegación de eventos para botones de editar/eliminar
    document.getElementById('inventoryTableBody').addEventListener('click', (e) => {
    const id = parseInt(e.target.dataset.id);
    const product = inventoryProducts.find(p => p.id_producto === id);
    
    if (e.target.classList.contains('edit-icon')) {
        openProductModal(product);
    } else if (e.target.classList.contains('delete-icon')) {
        deleteProduct(id);
    }
});

    document.getElementById('searchName').addEventListener('input', aplicarFiltros);
document.getElementById('searchCategory').addEventListener('input', aplicarFiltros);

}

// --- Funciones de exportación ---
function exportInventoryToCSV() {
    let csv = 'Código Barras,Nombre,Descripción,Precio,Stock,Proveedor,Estado\n';

    inventoryProducts.forEach(product => {
        csv += `"${product.codigo_barras}","${product.nombre}","${product.descripcion || ''}",${product.precio},${product.stock},"${getSupplierName(product.id_proveedor)}","${product.estado === 'activo' ? 'Activo' : 'Inactivo'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- Funciones de utilidad ---
function showLoading(show) {
    // Implement your loading indicator
    console.log(show ? 'Loading...' : 'Done loading');
}

function showError(message) {
    alert(message); // Replace with better error display
}

function filterAndRenderInventory() {
    const name = document.getElementById('searchByName').value.toLowerCase();
    const category = document.getElementById('searchByCategory').value.toLowerCase();

    filteredProducts = inventoryProducts.filter(product =>
        product.nombre.toLowerCase().includes(name) &&
        (!category || (product.categoria && product.categoria.toLowerCase().includes(category)))
    );

    currentPage = 1;
    renderInventory();
}

// Escuchar cambios en los campos de búsqueda
document.getElementById("searchByName").addEventListener("input", aplicarFiltros);
document.getElementById("searchByCategory").addEventListener("change", aplicarFiltros);


// Función para aplicar filtros
function aplicarFiltros() {
    const searchName = document.getElementById("searchName").value.toLowerCase();
    const searchCategory = document.getElementById("searchCategory").value;

    filteredProducts = inventoryProducts.filter(product => {
        const nombreCoincide = product.nombre.toLowerCase().includes(searchName);
        const categoriaCoincide = searchCategory === "" || product.categoria === searchCategory;
        return nombreCoincide && categoriaCoincide;
    });

    currentPage = 1;
    renderInventory();
}

