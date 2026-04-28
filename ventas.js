let promocionesActivas = [];
let products = [];
let cart = [];
let currentCategory = 'Todos';
const urlParams = new URLSearchParams(window.location.search);
const isGuest = urlParams.get('guest') === 'true';
const user = JSON.parse(localStorage.getItem('currentUser'));

document.addEventListener('DOMContentLoaded', async function () {

    await cargarPromocionesActivas(); 
    checkAuth();
    setupGuestMode();
    loadProducts();
    loadCart();
    setupEventListeners();
    updateDateTime();
    setInterval(updateDateTime, 60000);
});

function checkAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const isGuest = urlParams.get('guest') === 'true';

    if (!isGuest && (!user || (user.rol !== 'administrador' && user.rol !== 'cajero'))) {
        window.location.href = 'login.html';
    }
}

function setupGuestMode() {
    if (isGuest) {
        document.body.classList.add('guest-mode');
        if (document.getElementById('guestBanner')) {
            document.getElementById('guestBanner').style.display = 'block';
        }
        document.title = "Compra Rápida - Mi Tienda";

        const elementsToHide = document.querySelectorAll('.sidebar, .user-profile, .menu li:not(.active)');
        elementsToHide.forEach(el => el.style.display = 'none');

        if (document.querySelector('.main-content')) {
            document.querySelector('.main-content').style.marginLeft = '0';
        }
    }
}

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateEl = document.getElementById('current-date');
    const timeEl = document.getElementById('current-time');

    if (dateEl) dateEl.textContent = now.toLocaleDateString('es-MX', options);
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('es-MX');
}

async function loadProducts() {
    try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch('http://localhost:4000/api/inventory/products', {
            method: 'GET',
            headers
        });

        const text = await response.text();
        console.log('Respuesta cruda:', text);

        products = JSON.parse(text);
        renderProducts();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar productos');
    }
}

async function cargarPromocionesActivas() {
    try {
        const res = await fetch('http://localhost:4000/api/promociones/activas');
        promocionesActivas = await res.json();
        console.log('🎯 Promociones activas:', promocionesActivas);
    } catch (err) {
        console.error('❌ Error al cargar promociones activas:', err);
    }

    console.table(promocionesActivas.filter(p => p.aplicacion === 'producto'));// momentaneo 

}


function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    const filteredProducts = currentCategory === 'Todos'
        ? products.slice(0, 8)
        : products.filter(p => (p.categoria || '').toLowerCase() === currentCategory.toLowerCase());

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.setAttribute('data-category', (product.categoria || 'otros').toLowerCase());

        // Crear elemento de stock con formato condicional
        const stockClass = product.stock <= 3 ? 'stock-bajo' : '';
        const stockText = `<p class="${stockClass}">Stock: ${product.stock}</p>`;

        // Crear el botón según stock
        const btn = document.createElement('button');
        if (product.stock === 0) {
            btn.textContent = 'Sin stock';
            btn.disabled = true;
            btn.style.backgroundColor = '#ccc';
            btn.style.cursor = 'not-allowed';
        } else {
            btn.textContent = 'Agregar';
            btn.classList.add('btn-estilo');
            btn.addEventListener('click', () => addToCart(product.id_producto));
        }

        // Ensamblar tarjeta
        card.innerHTML = `
            <h4>${product.nombre}</h4>
            <p>Precio: $${product.precio}</p>
            ${stockText}
            <p>Categoría: ${product.categoria}</p>
        `;
        card.appendChild(btn);
        grid.appendChild(card);
    });
}


function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    cart = saved ? JSON.parse(saved) : [];
    renderCart();
}

function addToCart(productId) {
    const product = products.find(p => p.id_producto === productId);
    if (!product) {
        mostrarErrorModal('Producto no encontrado');
        return;
    }

    const item = cart.find(i => i.id_producto === productId);
    const cantidadEnCarrito = item ? item.cantidad : 0;

    // Verificar si la nueva cantidad supera el stock disponible
    if (cantidadEnCarrito + 1 > product.stock) {
        mostrarErrorModal('no_stock', product.nombre);
        return;
    }

    const promo = promocionesActivas.find(p =>
    (p.aplicacion === 'producto' && Number(p.id_producto) === Number(productId)) ||
    (p.aplicacion === 'categoria' && p.categoria === product.categoria) ||
    p.aplicacion === 'global'
    );

    // Agregar o aumentar cantidad
    if (item) {
    item.cantidad += 1;
    } else {
    cart.push({
        ...product,
        cantidad: 1,
        tipo_promocion: promo?.tipo_promocion || promo?.tipo || null,
        cantidad_minima: promo?.cantidad_minima || null,
        precio_promocional: promo?.precio_promocional || null
    });
}
 

    saveCart();
    renderCart();
}



function removeFromCart(productId) {
    cart = cart.filter(item => item.id_producto !== productId);
    saveCart();
    renderCart();
}

function renderCart() {
    const cartTable = document.getElementById('cartTable');
    const checkoutBtn = document.getElementById('checkoutBtn');
    cartTable.innerHTML = '';

    if (cart.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = "Aún no has comprado nada. ¡Empecemos ahora!";
        emptyMessage.style.color = '#888';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.marginTop = '10px';
        cartTable.appendChild(emptyMessage);
        checkoutBtn.style.display = 'none';
        return;
    }

    checkoutBtn.style.display = 'block';

    cart.forEach(item => {
        const descuento = calcularDescuentoPorPromocion(item);
        const precioTotal = item.precio * item.cantidad;
        const precioConDescuento = precioTotal - descuento;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>
                $${precioConDescuento.toFixed(2)}
                ${descuento > 0 ? `<br><small style="color: green;">Descuento aplicado: -$${descuento.toFixed(2)}</small>` : ''}
            </td>
            <td style="text-align:center;">
                <button class="btn-mini btn-red" onclick="decreaseQuantity(${item.id_producto})">–</button>
                <span style="margin: 0 6px;">${item.cantidad}</span>
                <button class="btn-mini btn-black" onclick="increaseQuantity(${item.id_producto})">+</button>
            </td>
        `;
        cartTable.appendChild(row);
    });

    updateTotals();
}









function increaseQuantity(id) {
    const item = cart.find(p => p.id_producto === id);
    const product = products.find(p => p.id_producto === id);
    
    if (!item || !product) return;

    if (item.cantidad >= product.stock) {
        mostrarErrorModal('no_stock', product.nombre);
        return;
    }

    item.cantidad++;
    saveCart();
    renderCart();
}


function decreaseQuantity(id) {
    const item = cart.find(p => p.id_producto === id);
    if (item) {
        item.cantidad--;
        if (item.cantidad <= 0) {
            cart = cart.filter(p => p.id_producto !== id);
        }
        saveCart();
        renderCart();
    }
}

function calcularDescuentoPorPromocion(item) {
    const cantidad = item.cantidad;
    const precio = item.precio;
    const tipo = item.tipo_promocion || null;
    const cantidadMin = item.cantidad_minima || 0;
    const precioPromo = item.precio_promocional || 0;

    if (!tipo || cantidad < 1) return 0;

    if (tipo === '3x1' && cantidad >= 3) {
        const grupos = Math.floor(cantidad / 3);
        return (precio * 2) * grupos;
    } else if (tipo === '3x2' && cantidad >= 3) {
        const grupos = Math.floor(cantidad / 3);
        return precio * grupos;
    } else if (tipo === 'Nx$' && cantidad >= cantidadMin) {
        const grupos = Math.floor(cantidad / cantidadMin);
        return (precio * cantidadMin - precioPromo) * grupos;
    }

    return 0;
}


function updateTotals() {
    let subtotal = 0;
    let totalDescuento = 0;

    cart.forEach(item => {
        const descuento = calcularDescuentoPorPromocion(item);
        const itemTotal = (item.precio * item.cantidad) - descuento;
        subtotal += itemTotal;
        totalDescuento += descuento;
    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    }
    if (document.getElementById('iva')) {
        document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
    }
    if (document.getElementById('total')) {
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    // Mostrar el total ahorrado (opcional)
    if (!document.getElementById('descuentoTotal')) {
        const div = document.createElement('div');
        div.className = 'cart-total-row';
        div.innerHTML = `<span>Descuento aplicado:</span><span id="descuentoTotal">$0.00</span>`;
        document.querySelector('.cart-totals').prepend(div);
    }

    document.getElementById('descuentoTotal').textContent = `-$${totalDescuento.toFixed(2)}`;
}


function clearCart() {
    cart = [];
    localStorage.removeItem('cart'); // Asegura limpieza completa
    renderCart();
}


async function Venta() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Token no encontrado. Inicia sesión.');
        return;
    }
    const metodoPagoTexto = document.querySelector('input[name="metodoPago"]:checked')?.value;
    const metodo_pago = metodoPagoTexto === 'cash' ? 1 :
        metodoPagoTexto === 'card' ? 2 :
            null;
    if (!metodo_pago) {
        alert('Selecciona un método de pago válido');
        return;
    }
    const cliente = {
        nombre: document.getElementById('inputNombreCliente')?.value || 'Invitado',
        correo: document.getElementById('inputCorreoCliente')?.value || 'noreply@ventas.com'
    };
    console.log("🧾 Enviando venta con método de pago ID:", metodo_pago);
    try {
        const response = await fetch('http://localhost:4000/api/ventas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productos: cart,
                metodo_pago,
                cliente
            })
        });
        if (response.ok) {
            alert('✅ Venta completada con éxito');
            clearCart();
            loadProducts();
        } else {
            const error = await response.json();
            alert(`❌ Error: ${error.error || 'desconocido'}`);
        }
    } catch (err) {
        console.error('❌ Error de red:', err);
        alert('Error al conectar con el servidor.');
    }
}

function guestCheckout() {
    abrirModal(); //  Siempre abrir modal, no importa el método de pago
}

function abrirModal() {
    document.getElementById('emailModal').style.display = 'flex';
}
function cerrarModal() {
    document.getElementById('emailModal').style.display = 'none';
}

function setupEventListeners() {
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function () {
            abrirClearCartModal(); // Modal bonito
        });
    }

    const cerrarErrorBtn = document.getElementById("cerrarErrorBtn");
    if (cerrarErrorBtn) {
        cerrarErrorBtn.addEventListener("click", cerrarErrorModal);
    }

    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.textContent;
            renderProducts();
        });
    });

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (cart.length > 0) {
                if (isGuest) {
                    guestCheckout();
                } else {
                    procesarVenta();
                }
            } else {
                alert('El carrito está vacío');
            }
        });
    }

    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            const productCards = document.querySelectorAll('.product-card');

            productCards.forEach(card => {
                const productName = card.querySelector('h4').textContent.toLowerCase();
                card.style.display = productName.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('userLoggedIn');
            window.location.href = 'login.html';
        });
    }

    const emailForm = document.getElementById('emailForm');
    const enviarBtn = document.getElementById("enviarBtn");
    const cancelarBtn = document.getElementById("cancelarBtn");

    if (cancelarBtn) {
        cancelarBtn.addEventListener("click", cerrarModal);
    }

    if (enviarBtn) {
        enviarBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            if (!nombre || !correo) {
                alert("Por favor completa todos los campos.");
                return;
            }
            const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
            if (!emailRegex.test(correo)) {
                alert("Por favor ingresa un correo electrónico válido.");
                return;
            }
            const metodoPago = document.querySelector('input[name="payment"]:checked')?.value || 'Efectivo';
            procesarVenta(nombre, correo, metodoPago);
        });
    }
}


async function procesarVenta(nombre = 'Invitado', correo = 'noreply@ventas.com', metodoPago = 'Efectivo') {
    const headers = {
        'Content-Type': 'application/json'
    };
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const productosParaEnviar = cart.map(p => ({
    id_producto: p.id_producto,
    cantidad: p.cantidad,
    precio_unitario: Number(p.precio),
    nombre: p.nombre
}));

    const metodo_pago = metodoPago === 'Efectivo' ? 1 :
        metodoPago === 'Tarjeta' ? 2 : null;
    if (!metodo_pago) {
        alert('Método de pago inválido');
        return;
    }
    console.log("📦 Enviando productos limpios al backend:", productosParaEnviar);
    console.log("💳 Método de pago:", metodo_pago);
    try {
        const response = await fetch('http://localhost:4000/api/ventas', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                productos: productosParaEnviar,
                metodo_pago,
                cliente: { nombre, correo }
            })
        });
        const result = await response.json();
        if (response.ok) {
           // alert('✅ Venta realizada y ticket enviado');
           mostrarSuccessModal(nombre, correo);

            clearCart();
            loadProducts();
            cerrarModal();
        } else {
    const result = await response.json();
    mostrarErrorModal(result.error, result.producto);
}

    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de red al procesar la venta');
    }
}
function mostrarErrorModal(errorCode, producto = '') {
    const modal = document.getElementById("errorModal");
    const mensajeElemento = document.getElementById("errorMensaje");

    if (errorCode === 'no_stock' && producto) {
        mensajeElemento.innerHTML = `Lo siento, por el momento no tenemos stock suficiente para <strong>${producto}</strong> 🫠`;
    } else {
        mensajeElemento.innerText = errorCode;
    }

    modal.style.display = "flex";
}

function cerrarErrorModal() {
    document.getElementById("errorModal").style.display = "none";
}
function mostrarSuccessModal(nombre, correo) {
  const modal = document.getElementById("successModal");
  const mensajeElemento = document.getElementById("successMensaje");
  mensajeElemento.innerHTML = `🎉 Gracias <strong>${nombre}</strong>, tu ticket ha sido enviado correctamente a <strong>${correo}</strong>.🎉`;

  modal.style.display = "flex";

  setTimeout(() => {
    modal.style.display = "none";
  }, 4000);
}

function abrirClearCartModal() {
    document.getElementById("clearCartModal").style.display = "flex";
}

function cerrarClearCartModal() {
    document.getElementById("clearCartModal").style.display = "none";
}

function confirmarClearCart() {
    clearCart();
    cerrarClearCartModal();
}

document.addEventListener('DOMContentLoaded', () => {
  const returnBtn = document.getElementById('returnBtn');
  const returnModal = document.getElementById('returnModal');
  const closeBtn = document.getElementById('closeReturnModal');
  const cancelBtn = document.getElementById('cancelDevolucion');

  if (returnBtn) {
    returnBtn.addEventListener('click', () => {
      returnModal.style.display = 'flex';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      returnModal.style.display = 'none';
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      returnModal.style.display = 'none';
    });
  }
});

