// --- Variables globales ---
let allUsers = [];

let usuariosData = [];         // todos los usuarios del backend
let usuariosFiltrados = [];    // resultado de los filtros
let currentPage = 1;
const usersPerPage = 50;       // o el número que uses


// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    //cargarRoles();

    // Configurar event listeners para filtros
    document.getElementById('role-filter').addEventListener('change', renderUsers);
    document.getElementById('status-filter').addEventListener('change', renderUsers);
    document.getElementById('user-search').addEventListener('input', renderUsers);
    document.getElementById("searchUserName").addEventListener("input", aplicarFiltroUsuarios);
document.getElementById("searchUserRole").addEventListener("change", aplicarFiltroUsuarios);

});

// --- Funciones de carga de datos ---
async function cargarRoles() {
    try {
        const res = await fetch('/api/usuarios/roles', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (!res.ok) throw new Error('Error al cargar roles');

        const roles = await res.json();
        const select = document.getElementById('role');
        select.innerHTML = '<option value="">Seleccionar...</option>';

        roles.forEach(rol => {
            select.innerHTML += `<option value="${rol.id_rol}">${rol.nombre_rol}</option>`;
        });
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudieron cargar los roles');
    }
}

async function cargarUsuarios() {
    try {
        const res = await fetch('/api/usuarios', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (!res.ok) throw new Error('Error al cargar usuarios');

        const data = await res.json();
        allUsers = data;
        renderUsers();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudieron cargar los usuarios');
    }
}

function renderUsers() {
    const roleFilter = document.getElementById('role-filter').value;
    const searchTerm = document.getElementById('user-search').value.trim().toLowerCase();
    const usersTableBody = document.getElementById('users-table-body');

    const filtered = allUsers.filter(user => {
        const roleMatch = roleFilter === 'all' || user.rol === roleFilter;
        const nameMatch = user.nombre.toLowerCase().startsWith(searchTerm);
        return roleMatch && nameMatch;
    });

    usersTableBody.innerHTML = '';

    if (filtered.length === 0) {
        usersTableBody.innerHTML = `
            <tr><td colspan="5">No se encontraron usuarios.</td></tr>
        `;
        return;
    }

    filtered.forEach(user => {
        usersTableBody.innerHTML += `
            <tr>
                <td>${user.id_usuario}</td>
                <td>${user.nombre}</td>
                <td>${user.numero_trabajador}</td>
                <td>${user.rol}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="editUser(${user.id_usuario})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteUser(${user.id_usuario})">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-icon btn-reset" onclick="showResetPasswordModal(${user.id_usuario}, '${user.nombre}')">
                            <i class="fas fa-key"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
}



// --- Funciones CRUD ---
function editUser(id) {
    const user = allUsers.find(u => u.id_usuario == id);
    if (!user) return;

    document.getElementById('user-id').value = user.id_usuario;
    document.getElementById('first-name').value = user.nombre;
    document.getElementById('numero_trabajador').value = user.numero_trabajador;
document.getElementById('role').value = user.rol;
console.log('Rol del usuario:', user.rol);


    // Ocultar contraseña y quitar required
    document.getElementById('password-group').style.display = 'none';
    document.getElementById('password').removeAttribute('required');

    document.getElementById('modal-title').textContent = 'Editar Usuario';
    document.getElementById('user-modal').style.display = 'block';
}


async function deleteUser(id) {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;

    try {
        const res = await fetch(`/api/usuarios/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        if (res.ok) {
            alert('Usuario eliminado correctamente');
            cargarUsuarios();
        } else {
            throw new Error(data.error || 'Error al eliminar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

// --- Funciones de gestión de contraseñas ---
function showResetPasswordModal(id, username) {
    document.getElementById('reset-user-id').value = id;
    document.getElementById('reset-username').textContent = username;
    document.getElementById('reset-password-modal').style.display = 'block';
}

document.getElementById('reset-password-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('reset-user-id').value;
    const nueva = document.getElementById('new-password').value;
    const confirmacion = document.getElementById('confirm-password').value;

    if (nueva !== confirmacion) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        const res = await fetch(`/api/usuarios/${id}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ nuevaPassword: nueva })
        });

        const result = await res.json();
       if (res.ok) {
    Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada correctamente',
        showConfirmButton: false,
        timer: 2000
    });
    document.getElementById('reset-password-modal').style.display = 'none';
    document.getElementById('reset-password-form').reset();
}
 else {
            throw new Error(result.error || 'Error al actualizar contraseña');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});

// --- Funciones de gestión de modales ---
document.getElementById('add-user-btn').addEventListener('click', () => {
    document.getElementById('user-id').value = '';
    document.getElementById('user-form').reset();
    
    // Mostrar contraseña y aplicar required
    document.getElementById('password-group').style.display = 'block';
    document.getElementById('password').setAttribute('required', 'required');

    document.getElementById('modal-title').textContent = 'Nuevo Usuario';
    document.getElementById('user-modal').style.display = 'block';
});


// --- Funciones de formularios ---
document.getElementById('user-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('user-id').value;
    const isNew = id === '';

   const userData = {
    nombre: document.getElementById('first-name').value,
    numero_trabajador: document.getElementById('numero_trabajador').value,
    id_rol: parseInt(document.getElementById('role').value)
};


    if (isNew) {
        userData.contrasena = document.getElementById('password').value;
    }

    try {
        const url = isNew ? '/api/usuarios' : `/api/usuarios/${id}`;
        const method = isNew ? 'POST' : 'PUT';

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(userData)
        });

        const result = await res.json();
        if (res.ok) {
    Swal.fire({
        icon: 'success',
        title: isNew ? 'Usuario creado correctamente' : 'Usuario actualizado correctamente',
        showConfirmButton: false,
        timer: 2000
    });
    document.getElementById('user-modal').style.display = 'none';
    cargarUsuarios();
}
 else {
            throw new Error(result.error || (isNew ? 'Error al crear usuario' : 'Error al actualizar usuario'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});

// Cerrar modales al hacer clic en la X
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Cerrar modales al hacer clic fuera del contenido
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

document.querySelectorAll('.btn-cancel').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
  });
});
// Mostrar/Ocultar contraseña en el modal de restablecer
document.querySelectorAll('.show-password').forEach(btn => {
  btn.addEventListener('click', function () {
    const input = this.previousElementSibling;
    const icon = this.querySelector('i');
    const isVisible = input.type === 'text';

    input.type = isVisible ? 'password' : 'text';
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
});

// Mostrar/Ocultar todas las contraseñas con clase .show-password o #show-password
document.querySelectorAll('.show-password, #show-password').forEach(btn => {
  btn.addEventListener('click', function () {
    const input = this.previousElementSibling;
    const icon = this.querySelector('i');
    const isVisible = input.type === 'text';

    input.type = isVisible ? 'password' : 'text';
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
});

document.querySelector('.btn-search').addEventListener('click', renderUsers);
document.getElementById('user-search').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        renderUsers();
    }
});


function aplicarFiltroUsuarios() {
  const nombre = document.getElementById("searchUserName").value.toLowerCase();
  const rol = document.getElementById("searchUserRole").value;

  usuariosFiltrados = usuariosData.filter(usuario => {
    const nombreCoincide = usuario.nombre.toLowerCase().includes(nombre);
    const rolCoincide = rol === "" || usuario.rol === rol;
    return nombreCoincide && rolCoincide;
  });

  currentPage = 1;
  renderUsuarios();
}

