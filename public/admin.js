(function(){
  const passInput = document.getElementById('admin-pass');
  const loginBtn = document.getElementById('login-btn');
  const loginCard = document.getElementById('login-card');
  const loginError = document.getElementById('login-error');
  const content = document.getElementById('admin-content');
  const saveBtn = document.getElementById('save-btn');
  const saveMsg = document.getElementById('save-msg');
  const listEl = document.getElementById('props-list');
  const fileInput = document.getElementById('f-file');
  const uploadBtn = document.getElementById('btn-upload');
  const uploadMsg = document.getElementById('up-msg');

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
          <button data-id="${p.id}" class="btn btn-hide" style="background:#6b7280;">Ocultar</button>
          <button data-id="${p.id}" class="btn btn-del" style="background:#c84a4a;">Borrar</button>
        </div>
      </div>
    `).join('');
    document.querySelectorAll('.btn-hide').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('¿Ocultar este inmueble del sitio?')) return;
        const res = await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
          body: JSON.stringify({ id, hidden: true })
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          alert('No se pudo ocultar: ' + txt);
          return;
        }
        await loadList();
      });
    });
    document.querySelectorAll('.btn-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('¿Borrar este inmueble?')) return;
        const res = await fetch(`/api/properties?id=${encodeURIComponent(id)}` , {
          method: 'DELETE',
          headers: { 'x-admin-token': token }
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          alert('No se pudo borrar: ' + txt);
          return;
        }
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

  uploadBtn?.addEventListener('click', async () => {
    if (!fileInput?.files?.length) {
      alert('Selecciona una o varias imágenes');
      return;
    }
    uploadMsg.style.display = 'inline';
    const urls = [];
    for (const file of fileInput.files) {
      const dataUrl = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.readAsDataURL(file);
      });
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ name: file.name, dataBase64: dataUrl })
      });
      if (!res.ok) {
        uploadMsg.style.display = 'none';
        alert('Error subiendo imagen');
        return;
      }
      const { url } = await res.json();
      urls.push(url);
    }
    uploadMsg.style.display = 'none';
    const input = document.getElementById('f-image');
    const existing = input.value.trim();
    input.value = [existing, ...urls].filter(Boolean).join(', ');
  });

  saveBtn.addEventListener('click', async () => {
    const title = document.getElementById('f-title').value.trim();
    const price = document.getElementById('f-price').value.trim();
    const status = document.getElementById('f-status').value.trim().toLowerCase();
    const imageField = document.getElementById('f-image').value.trim();
    const details = document.getElementById('f-details').value.split('\n').map(s => s.trim()).filter(Boolean);
    const amenities = document.getElementById('f-amenities').value.split(',').map(s => s.trim()).filter(Boolean);
    const whatsappText = document.getElementById('f-wa').value.trim();

    if (!title || !price || !status || !imageField) {
      alert('Completa título, precio, estado e imagen');
      return;
    }

    const images = imageField.split(',').map(s => s.trim()).filter(Boolean);
    const image = images[0];
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ title, price, status, image, images, details, amenities, whatsappText })
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
      try {
        const check = await fetch('/api/properties', { cache: 'no-store' });
        const arr = await check.json();
        console.log('Properties after save:', arr);
        if (!Array.isArray(arr) || arr.length === 0) {
          alert('Guardado enviado pero no se refleja aún. Intenta refrescar y verifica el token Blob.');
        }
      } catch (_) {}
    } else {
      const txt = await res.text().catch(() => '');
      alert('Error al guardar: ' + txt);
    }
  });

  checkAuth();
})();


