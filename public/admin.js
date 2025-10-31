(function(){
  const passInput = document.getElementById('admin-pass');
  const loginBtn = document.getElementById('login-btn');
  const loginCard = document.getElementById('login-card');
  const loginError = document.getElementById('login-error');
  const content = document.getElementById('admin-content');
  const saveBtn = document.getElementById('save-btn');
  const saveMsg = document.getElementById('save-msg');
  const listEl = document.getElementById('props-list');

  let token = '';

  function checkAuth() {
    const stored = sessionStorage.getItem('adminToken');
    if (stored === ADMIN_PASSWORD) {
      token = stored;
      loginCard.style.display = 'none';
      content.style.display = 'block';
      loadList();
      return true;
    }
    return false;
  }

  async function loadList() {
    listEl.innerHTML = '<div style="color:#ccc;">Cargando...</div>';
    const res = await fetch('/api/properties', { cache: 'no-store' });
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) {
      listEl.innerHTML = '<div style="color:#aaa;">Sin inmuebles</div>';
      return;
    }
    listEl.innerHTML = items.map(p => `
      <div class="prop-item">
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${p.image}" alt="${p.title}" style="width:56px; height:56px; object-fit:cover; border-radius:8px;" />
          <div style="flex:1;">
            <div style="color:#fff; font-weight:600;">${p.title}</div>
            <div style="color:#9ad; font-size:12px;">${p.status} · ${p.price}</div>
          </div>
          <button data-id="${p.id}" class="btn btn-del" style="background:#c84a4a;">Borrar</button>
        </div>
      </div>
    `).join('');
    document.querySelectorAll('.btn-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('¿Borrar este inmueble?')) return;
        await fetch(`/api/properties?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { 'x-admin-token': token }
        });
        await loadList();
      });
    });
  }

  loginBtn.addEventListener('click', () => {
    const val = passInput.value.trim();
    if (val === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminToken', val);
      token = val;
      loginError.style.display = 'none';
      loginCard.style.display = 'none';
      content.style.display = 'block';
      loadList();
    } else {
      loginError.style.display = 'block';
    }
  });

  saveBtn.addEventListener('click', async () => {
    const title = document.getElementById('f-title').value.trim();
    const price = document.getElementById('f-price').value.trim();
    const status = document.getElementById('f-status').value.trim().toLowerCase();
    const image = document.getElementById('f-image').value.trim();
    const details = document.getElementById('f-details').value.split('\n').map(s => s.trim()).filter(Boolean);
    const amenities = document.getElementById('f-amenities').value.split(',').map(s => s.trim()).filter(Boolean);
    const whatsappText = document.getElementById('f-wa').value.trim();

    if (!title || !price || !status || !image) {
      alert('Completa título, precio, estado e imagen');
      return;
    }

    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ title, price, status, image, details, amenities, whatsappText })
    });
    if (res.ok) {
      saveMsg.style.display = 'block';
      setTimeout(() => saveMsg.style.display = 'none', 1200);
      // limpiar campos
      document.getElementById('f-title').value = '';
      document.getElementById('f-price').value = '';
      document.getElementById('f-status').value = '';
      document.getElementById('f-image').value = '';
      document.getElementById('f-details').value = '';
      document.getElementById('f-amenities').value = '';
      document.getElementById('f-wa').value = '';
      await loadList();
    } else {
      alert('Error al guardar');
    }
  });

  checkAuth();
})();


