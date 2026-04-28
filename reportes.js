let paymentChart = null;
let topProductsChart = null;


document.addEventListener('DOMContentLoaded', function() {
    flatpickr(".datepicker", {
        locale: "es",
        dateFormat: "d/m/Y",
        allowInput: true
    });

    document.querySelectorAll('.frequency-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.frequency-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const isCustom = this.dataset.frequency === 'custom';
            document.getElementById('custom-date-range').style.display = isCustom ? 'block' : 'none';
        });
    });



    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    document.getElementById('generate-report').addEventListener('click', fetchAndRenderSalesReport);

    document.getElementById('export-pdf').addEventListener('click', function () {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const category = document.getElementById('category-filter').value;
        const paymentMethod = document.getElementById('payment-filter').value;

        const query = new URLSearchParams();
        if (startDate) query.append('startDate', startDate);
        if (endDate) query.append('endDate', endDate);
        if (category && category !== 'all') query.append('category', category);
        if (paymentMethod && paymentMethod !== 'all') query.append('paymentMethod', paymentMethod);

        const token = localStorage.getItem('token');

        fetch(`/api/reports/sales/pdf?${query.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('No autorizado o error al generar PDF');
            return res.blob();
        })
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'reporte_ventas.pdf';
            link.click();
        })
        .catch(err => {
            console.error('Error exportando PDF:', err);
            alert('No se pudo exportar el PDF');
        });
    });

    document.getElementById('export-csv').addEventListener('click', function () {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const category = document.getElementById('category-filter').value;
        const paymentMethod = document.getElementById('payment-filter').value;

        const query = new URLSearchParams();
        if (startDate) query.append('startDate', startDate);
        if (endDate) query.append('endDate', endDate);
        if (category && category !== 'all') query.append('category', category);
        if (paymentMethod && paymentMethod !== 'all') query.append('paymentMethod', paymentMethod);

        const token = localStorage.getItem('token');

        fetch(`/api/reports/sales/export?${query.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('No autorizado o error al generar CSV');
            return res.blob();
        })
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'reporte_ventas.csv';
            link.click();
        })
        .catch(err => {
            console.error('Error exportando CSV:', err);
            alert('No se pudo exportar el reporte');
        });
    });

    document.getElementById('reset-filters').addEventListener('click', function() {
        document.getElementById('report-type').value = 'sales';
        document.querySelector('.frequency-btn').click();
        document.getElementById('branch-filter').value = 'all';
        document.getElementById('seller-filter').value = 'all';
        document.getElementById('category-filter').value = 'all';
        document.getElementById('payment-filter').value = 'all';
        document.getElementById('start-date').value = '';
        document.getElementById('end-date').value = '';
    });
});

async function fetchAndRenderSalesReport() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const paymentMethod = document.getElementById('payment-filter').value;
    const category = document.getElementById('category-filter').value;
    const providerId = document.getElementById('provider-filter').value;

    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    if (paymentMethod && paymentMethod !== 'all') query.append('paymentMethod', paymentMethod);
    if (category && category !== 'all') query.append('category', category);
    if (providerId && providerId !== 'all') query.append('proveedorId', providerId);


    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/reports/sales?${query.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        renderSalesTable(data);
    } catch (err) {
        console.error('Error al obtener reporte de ventas:', err);
        alert('No se pudo generar el reporte');
    }




}

function renderSalesTable(data) {
    const tbody = document.querySelector('#sales-data .data-table tbody');
    tbody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.folio}</td>
            <td>${row.fecha}</td>
            <td>${row.productos}</td>
            <td>${row.cantidades}</td>
            <td>${row.precios}</td>
            <td>${row.subtotal}</td>
            <td>${row.iva}</td>
            <td>${row.total}</td>
            <td>${row.metodo_pago}</td>
            <td>${row.descuento}</td>
            <td>${row.categorias}</td>
        `;
        tbody.appendChild(tr);
    });
}

async function cargarProveedores() {
    const token = localStorage.getItem('token');

    try {
        const res = await fetch('/api/reports/proveedores', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Error al cargar proveedores');

        const proveedores = await res.json();
        const select = document.getElementById('provider-filter');
        select.innerHTML = '<option value="all">Todos</option>'; // limpiar

        proveedores.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id_proveedor;
            option.textContent = p.nombre;
            select.appendChild(option);
        });
    } catch (err) {
        console.error(err);
        alert('Error al cargar proveedores');
    }
}

// Llama a la función al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarProveedores();
    cargarProductosMasVendidos();
    cargarMetodosPago();
    cargarResumenDashboard();
});

async function cargarProductosMasVendidos() {
    const token = localStorage.getItem('token');
const res = await fetch('/api/reports/products/most-sold', {
    headers: { 'Authorization': `Bearer ${token}` }
});
if (!res.ok) throw new Error('Error al cargar productos más vendidos');
const productos = await res.json();

// Tabla...
const tbody = document.querySelector('#top-products .data-table tbody');
tbody.innerHTML = '';
productos.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${p.producto}</td>
        <td>${p.categoria}</td>
        <td>${p.unidades_vendidas}</td>
        <td>$${parseFloat(p.ingresos_generados).toFixed(2)}</td>
    `;
    tbody.appendChild(row);
});

// 🟢 Aquí ya puedes destruir y crear el Chart
const ctx = document.getElementById('topProductsChart').getContext('2d');
if (topProductsChart) topProductsChart.destroy();

topProductsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: productos.map(p => p.producto),
        datasets: [{
            label: 'Unidades Vendidas',
            data: productos.map(p => p.unidades_vendidas)
        }]
    }
});
 
}

async function cargarMetodosPago() {
    const token = localStorage.getItem('token');
const res = await fetch('/api/reports/payment-methods', {
    headers: { 'Authorization': `Bearer ${token}` }
});
if (!res.ok) throw new Error('Error al cargar métodos de pago');
const datos = await res.json();

const ctx = document.getElementById('paymentMethodsChart').getContext('2d');
if (paymentChart) paymentChart.destroy();

paymentChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: datos.map(d => d.tipo_pago),
        datasets: [{
            label: 'Total Recaudado',
            data: datos.map(d => d.total_recaudado)
        }]
    }
});


}

async function cargarResumenDashboard() {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('/api/reports/dashboard/resumen', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('No se pudo cargar el resumen');

    const data = await res.json();

    // Ventas totales
    document.getElementById('resumen-subtotal').textContent = `$${parseFloat(data.ventas.total_subtotal).toFixed(2)}`;
    document.getElementById('resumen-iva').textContent = `$${parseFloat(data.ventas.total_iva).toFixed(2)}`;

    // Transacciones
    document.getElementById('resumen-transacciones').textContent = data.ventas.total_ventas;

    // Métodos de pago
    data.metodos.forEach(m => {
      const linea = document.createElement('div');
      linea.textContent = `${m.tipo_pago}: ${m.cantidad}`;
      document.getElementById('resumen-metodos').appendChild(linea);
    });

    // Productos vendidos
    document.getElementById('resumen-unidades').textContent = data.productos.total_unidades;

    // Productos por categoría
    data.categorias.forEach(c => {
      const linea = document.createElement('div');
      linea.textContent = `${c.categoria}: ${c.unidades}`;
      document.getElementById('resumen-categorias').appendChild(linea);
    });

  } catch (err) {
    console.error(err);
    alert('No se pudo cargar el resumen del dashboard');
  }
}

document.getElementById('report-type').addEventListener('change', (e) => {
  const tipo = e.target.value;

  const filtrosVentas = document.getElementById('filtros-ventas');
  const filtrosInventario = document.getElementById('filtros-inventario');
  const tablaVentas = document.getElementById('tabla-ventas');
  const tablaInventario = document.getElementById('tabla-inventario');

  if (tipo === 'ventas') {
    filtrosVentas.style.display = 'block';
    filtrosInventario.style.display = 'none';
    tablaVentas.style.display = 'block';
    tablaInventario.style.display = 'none';
  } else {
    filtrosVentas.style.display = 'none';
    filtrosInventario.style.display = 'block';
    tablaVentas.style.display = 'none';
    tablaInventario.style.display = 'block';
  }

  if (tipo === 'inventario') {
  fetchAndRenderInventoryReport();
}

});

async function fetchAndRenderInventoryReport() {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('/api/reports/inventory', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('No se pudo obtener el inventario');

    const inventario = await res.json();
    const tbody = document.querySelector('#tabla-inventario tbody');
    tbody.innerHTML = ''; // limpiar contenido anterior

    inventario.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${p.producto}</td>
        <td>${p.categoria}</td>
        <td>${p.stock}</td>
        <td>$${parseFloat(p.precio).toFixed(2)}</td>
        <td>${p.proveedor}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    alert('Error al cargar el inventario');
  }
}



