function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateEl = document.getElementById('current-date');
  const timeEl = document.getElementById('current-time');

  if (dateEl) dateEl.textContent = now.toLocaleDateString('es-MX', options);
  if (timeEl) timeEl.textContent = now.toLocaleTimeString('es-MX');
}
setInterval(updateDateTime, 1000);
updateDateTime();

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const logoutBtn = document.getElementById('logout-btn');

  if (!user && window.location.pathname !== '/login.html') {
    window.location.href = 'login.html';
    return;
  }

  if (user) {
    const userNameSpan = document.querySelector('.user-profile span');
    if (userNameSpan) userNameSpan.textContent = user.nombre;

    document.querySelectorAll('.menu li').forEach(item => {
      const href = item.querySelector('a')?.getAttribute('href');
      if (user.rol === 'cajero' && ['usuarios.html', 'reportes.html'].includes(href)) {
        item.style.display = 'none';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }

  // ✅ Mostrar botón "Devoluciones" solo si es cajero
  const returnBtn = document.getElementById('returnBtn');
  if (returnBtn && (!user || user.id_rol !== 2)) {
    returnBtn.style.display = 'none';
  }

  
});
