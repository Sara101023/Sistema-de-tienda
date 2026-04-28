document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('promo-modal');
  const openModalBtn = document.getElementById('add-promo-btn');
  const closeModalBtn = document.querySelector('.close-modal');
  const cancelBtn = document.querySelector('.btn-cancel');

  // Mostrar modal
  openModalBtn.addEventListener('click', () => {
    document.getElementById('modal-title').textContent = 'Nueva Promoción';
    modal.style.display = 'flex';
  });

  // Cerrar modal al hacer click en la X o Cancelar
  [closeModalBtn, cancelBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  });

  // Cerrar modal al hacer click fuera del contenido
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Mostrar campos condicionales según tipo de promoción
  const promoType = document.getElementById('promo-type');
  const discountAmountGroup = document.getElementById('discount-amount-group');
  const buyXGetYGroup = document.getElementById('buyxgety-group');

  promoType.addEventListener('change', function () {
    if (this.value === 'buyxgety') {
      discountAmountGroup.style.display = 'none';
      buyXGetYGroup.style.display = 'block';
    } else if (this.value === 'free_shipping') {
      discountAmountGroup.style.display = 'none';
      buyXGetYGroup.style.display = 'none';
    } else {
      discountAmountGroup.style.display = 'block';
      buyXGetYGroup.style.display = 'none';
    }
  });

  // Mostrar categorías si se selecciona esa opción
  const promoProducts = document.getElementById('promo-products');
  const categoryGroup = document.getElementById('category-group');

  promoProducts.addEventListener('change', function () {
    categoryGroup.style.display = this.value === 'category' ? 'block' : 'none';
  });

  // Enviar formulario
  const promoForm = document.getElementById('promo-form');
  promoForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const tipoSeleccionado = document.getElementById('promo-type').value;
  const aplicacion = document.getElementById('promo-products').value;
  const promoType = document.getElementById('promo-type').value;
  const categoria = document.getElementById('promo-category')?.value;

if (aplicacion === 'category' && (!categoria || categoria === '')) {
  alert('❌ Debes seleccionar una categoría válida.');
  return;
}

  
  const data = {
  nombre: document.getElementById('promo-name').value,
  aplicacion: aplicacion === 'all' ? 'global' : (aplicacion === 'products' ? 'producto' : 'categoria'),
  fecha_inicio: document.getElementById('promo-start').value,
  fecha_fin: document.getElementById('promo-end').value,
  descripcion: document.getElementById('promo-description').value,
};

if (aplicacion === 'category') {
  data.categoria = categoria;
}

  // 🔐 Validar tipo de promoción
  if (tipoSeleccionado !== 'buyxgety') {
    alert("❌ Solo se permiten promociones tipo 3x1, 3x2 o Nx$.");
    return;
  }

  const buyX = document.getElementById('buy-quantity').value;
  const getY = document.getElementById('get-quantity').value;

  if (!buyX || !getY || parseInt(buyX) < 1 || parseInt(getY) < 1) {
    alert("⚠️ Debes especificar cantidades válidas para 'Compra X' y 'Lleva Y'");
    return;
  }

  if (aplicacion === 'products') {
  if (selectedProductIds.length === 0) {
    alert("❌ Debes seleccionar al menos un producto.");
    return;
  }
  data.productos = selectedProductIds;
}


  data.buyX = buyX;
  data.getY = getY;

  // Traducir a tipo_promocion válido
  if (buyX === '3' && getY === '1') {
    data.tipo_promocion = '3x1';
  } else if (buyX === '3' && getY === '2') {
    data.tipo_promocion = '3x2';
  } else {
    data.tipo_promocion = 'Nx$';
    const precioPromo = prompt("💰 Ingresa el precio promocional para esta oferta:");
    if (!precioPromo || isNaN(precioPromo)) {
      alert("❌ Debes ingresar un precio válido para la promoción Nx$");
      return;
    }
    data.precio_promocional = parseFloat(precioPromo);
    data.cantidad_minima = parseInt(buyX);
  }

  // Enviar al backend
  try {
    const res = await fetch('/api/promociones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert('✅ Promoción guardada correctamente');
      promoForm.reset();
      cargarPromociones();
    } else {
      const error = await res.json();
      alert('❌ Hubo un problema: ' + error.error);
    }
  } catch (err) {
    console.error('❌ Error al guardar promoción:', err);
    alert('Error al conectar con el servidor.');
  }
});

  // Botones de editar
  const editButtons = document.querySelectorAll('.btn-edit');
  editButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('tr');
      document.getElementById('modal-title').textContent = 'Editar Promoción';
      modal.style.display = 'flex';
    });
  });

  // Botones de eliminar
  const deleteButtons = document.querySelectorAll('.btn-delete');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      if (confirm('¿Estás seguro de eliminar esta promoción?')) {
        this.closest('tr').remove();
      }
    });
  });
});

const promoProducts = document.getElementById('promo-products');
const categoryGroup = document.getElementById('category-group');
const productsGroup = document.getElementById('products-group');

promoProducts.addEventListener('change', function () {
  categoryGroup.style.display = this.value === 'category' ? 'block' : 'none';
  productsGroup.style.display = this.value === 'products' ? 'block' : 'none';
});

// Autocompletado
const productSearch = document.getElementById('product-search');
const productSuggestions = document.getElementById('product-suggestions');
const selectedProducts = document.getElementById('selected-products');
let selectedProductIds = [];

productSearch.addEventListener('input', function () {
  const query = this.value;
  if (query.length < 2) {
    productSuggestions.innerHTML = '';
    return;
  }

  fetch(`/api/productos?search=${encodeURIComponent(query)}`)
    .then(async res => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
  return res.json();
})

    .then(productos => {
      productSuggestions.innerHTML = '';
      productos.forEach(p => {
        const div = document.createElement('div');
        div.textContent = p.nombre;
        div.dataset.id = p.id_producto;
        productSuggestions.appendChild(div);
      });
    });
});

productSuggestions.addEventListener('click', function (e) {
  if (e.target.tagName === 'DIV') {
    const nombre = e.target.textContent;
    const id = e.target.dataset.id;

    if (!selectedProductIds.includes(id)) {
      selectedProductIds.push(id);

      const tag = document.createElement('span');
      tag.className = 'product-tag';
      tag.textContent = nombre;
      selectedProducts.appendChild(tag);
    }

    productSearch.value = '';
    productSuggestions.innerHTML = '';
  }
});
async function cargarPromociones() {
  const res = await fetch('/api/promociones');
  const promociones = await res.json();

  const tbody = document.querySelector('table.data-table tbody');
  tbody.innerHTML = ''; // Limpiar tabla

  promociones.forEach(promo => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${promo.nombre}</td>
      <td>${promo.tipo}</td>
      <td>${promo.descuento || `${promo.buy_x}x${promo.get_y}`}</td>
      <td>${promo.aplicacion === 'category' ? promo.categoria : promo.aplicacion}</td>
      <td>${promo.fecha_fin}</td>
      <td><span class="status-badge active">Activa</span></td>
      <td>
        <button class="btn-edit"><i class="fas fa-edit"></i></button>
        <button class="btn-delete"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Llamar al cargar la página
document.addEventListener('DOMContentLoaded', cargarPromociones);
