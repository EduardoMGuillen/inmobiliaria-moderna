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
  const btnCreate = document.getElementById('btn-create');
  const btnEdit = document.getElementById('btn-edit');
  const createSection = document.getElementById('create-section');
  const editSection = document.getElementById('edit-section');
  const editSelectView = document.getElementById('edit-select-view');
  const editFormView = document.getElementById('edit-form-view');
  const editPropertiesList = document.getElementById('edit-properties-list');
  const btnBackEdit = document.getElementById('btn-back-edit');
  const updateBtn = document.getElementById('update-btn');
  const updateMsg = document.getElementById('update-msg');
  const editFileInput = document.getElementById('edit-file');
  const btnUploadEdit = document.getElementById('btn-upload-edit');
  const uploadMsgEdit = document.getElementById('up-msg-edit');

  let token = '';

  function checkAuth() {
    // Check if ADMIN_PASSWORD is available
    if (typeof ADMIN_PASSWORD === 'undefined') {
      console.error('ADMIN_PASSWORD no está definida en checkAuth');
      return false;
    }
    const stored = sessionStorage.getItem('adminToken');
    if (stored === ADMIN_PASSWORD) {
      token = stored;
      loginCard.style.display = 'none';
      content.style.display = 'block';
      // Hide sections by default
      createSection.style.display = 'none';
      editSection.style.display = 'none';
      btnCreate.style.opacity = '0.6';
      btnEdit.style.opacity = '0.6';
      loadList();
      return true;
    }
    return false;
  }

  // Store current items for optimistic updates
  let currentItems = [];

  async function loadList(showLoading = true) {
    if (showLoading) {
      listEl.innerHTML = '<div style="color:#ccc; text-align:center; padding:20px;">Cargando...</div>';
    }
    const headers = token ? { 'x-admin-token': token, 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } : { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' };
    const res = await fetch(`/api/properties?all=1&t=${Date.now()}`, { 
      cache: 'no-store',
      headers: headers
    });
    const items = await res.json();
    currentItems = items || [];
    if (!Array.isArray(items) || items.length === 0) {
      listEl.innerHTML = '<div style="color:#aaa; text-align:center; padding:20px;">Sin inmuebles</div>';
      return;
    }
    listEl.innerHTML = items.map(p => {
      const featuredCount = items.filter(prop => prop.featured && !prop.hidden).length;
      const canFeature = !p.featured && featuredCount < 5;
      return `
      <div class="prop-item">
        <div class="prop-item-content">
          <img src="${p.image}" alt="${p.title}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; flex-shrink:0;" />
          <div style="flex:1;">
            <div style="color:#fff; font-weight:600; margin-bottom:4px;">${p.title} ${p.hidden ? '<span style="color:#f59e0b; font-size:11px; margin-left:6px;">(Oculto)</span>' : ''} ${p.featured ? '<span style="color:#fbbf24; font-size:11px; margin-left:6px;">⭐ Destacado</span>' : ''}</div>
            <div style="color:#9ad; font-size:13px;">${p.status} · ${p.price}</div>
          </div>
        </div>
        <div class="prop-item-actions">
          ${p.featured ? `<button data-id="${p.id}" class="btn btn-unfeature btn-small" style="background:#f59e0b;">Quitar destacado</button>` : `<button data-id="${p.id}" class="btn btn-feature btn-small" style="background:#fbbf24;" ${!canFeature ? 'disabled title="Ya hay 5 destacados"' : ''}>Destacar</button>`}
          ${p.hidden ? `<button data-id="${p.id}" class="btn btn-show btn-small" style="background:#3b82f6;">Mostrar</button>` : `<button data-id="${p.id}" class="btn btn-hide btn-small" style="background:#6b7280;">Ocultar</button>`}
          <button data-id="${p.id}" class="btn btn-del btn-small" style="background:#c84a4a;">Borrar</button>
        </div>
      </div>
    `;
    }).join('');
    
    // Re-attach all event listeners
    attachEventListeners();
  }

  function attachEventListeners() {
    document.querySelectorAll('.btn-hide').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('¿Ocultar este inmueble del sitio?')) return;
        
        // Optimistic update - actualizar UI inmediatamente
        const propItem = btn.closest('.prop-item');
        if (propItem) {
          propItem.style.opacity = '0.5';
          propItem.style.pointerEvents = 'none';
          btn.disabled = true;
          btn.textContent = 'Ocultando...';
        }
        
        try {
          const res = await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
            body: JSON.stringify({ id, hidden: true })
          });
          if (!res.ok) {
            const txt = await res.text().catch(() => '');
            alert('No se pudo ocultar: ' + txt);
            // Revertir cambio visual
            if (propItem) {
              propItem.style.opacity = '1';
              propItem.style.pointerEvents = 'auto';
              btn.disabled = false;
              btn.textContent = 'Ocultar';
            }
            return;
          }
          // Recargar lista para confirmar
          await loadList(false);
        } catch (error) {
          alert('Error de conexión: ' + error.message);
          // Revertir cambio visual
          if (propItem) {
            propItem.style.opacity = '1';
            propItem.style.pointerEvents = 'auto';
            btn.disabled = false;
            btn.textContent = 'Ocultar';
          }
        }
      });
    });
    document.querySelectorAll('.btn-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('¿Borrar este inmueble?')) return;
        
        // Optimistic update - remover inmediatamente de la UI
        const propItem = btn.closest('.prop-item');
        let originalHTML = '';
        if (propItem) {
          originalHTML = propItem.outerHTML;
          propItem.style.transition = 'opacity 0.3s, transform 0.3s';
          propItem.style.opacity = '0';
          propItem.style.transform = 'translateX(-20px)';
          setTimeout(() => {
            propItem.remove();
          }, 300);
        }
        
        try {
          const res = await fetch(`/api/properties?id=${encodeURIComponent(id)}` , {
            method: 'DELETE',
            headers: { 'x-admin-token': token }
          });
          if (!res.ok) {
            const txt = await res.text().catch(() => '');
            alert('No se pudo borrar: ' + txt);
            // Revertir cambio visual
            if (propItem && originalHTML) {
              propItem.style.opacity = '1';
              propItem.style.transform = 'translateX(0)';
            } else if (listEl && originalHTML) {
              listEl.insertAdjacentHTML('beforeend', originalHTML);
              // Re-attach event listeners
              attachEventListeners();
            }
            return;
          }
          // Recargar lista para confirmar
          await loadList(false);
        } catch (error) {
          alert('Error de conexión: ' + error.message);
          // Revertir cambio visual
          if (propItem && originalHTML) {
            propItem.style.opacity = '1';
            propItem.style.transform = 'translateX(0)';
          } else if (listEl && originalHTML) {
            listEl.insertAdjacentHTML('beforeend', originalHTML);
            attachEventListeners();
          }
        }
      });
    });
    document.querySelectorAll('.btn-show').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        
        // Optimistic update
        const propItem = btn.closest('.prop-item');
        if (propItem) {
          propItem.style.opacity = '0.5';
          propItem.style.pointerEvents = 'none';
          btn.disabled = true;
          btn.textContent = 'Mostrando...';
        }
        
        try {
          const res = await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
            body: JSON.stringify({ id, hidden: false })
          });
          if (!res.ok) {
            const txt = await res.text().catch(() => '');
            alert('No se pudo mostrar: ' + txt);
            if (propItem) {
              propItem.style.opacity = '1';
              propItem.style.pointerEvents = 'auto';
              btn.disabled = false;
              btn.textContent = 'Mostrar';
            }
            return;
          }
          await loadList(false);
        } catch (error) {
          alert('Error de conexión: ' + error.message);
          if (propItem) {
            propItem.style.opacity = '1';
            propItem.style.pointerEvents = 'auto';
            btn.disabled = false;
            btn.textContent = 'Mostrar';
          }
        }
      });
    });
    
    document.querySelectorAll('.btn-feature').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (btn.disabled) return;
        const id = btn.getAttribute('data-id');
        
        // Optimistic update
        const propItem = btn.closest('.prop-item');
        const originalText = btn.textContent;
        if (propItem) {
          btn.disabled = true;
          btn.textContent = 'Destacando...';
          btn.style.opacity = '0.6';
        }
        
        try {
          const res = await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
            body: JSON.stringify({ id, featured: true })
          });
          if (!res.ok) {
            const result = await res.json().catch(() => ({ error: 'Error desconocido' }));
            alert('No se pudo destacar: ' + (result.error || 'Error desconocido'));
            if (propItem) {
              btn.disabled = false;
              btn.textContent = originalText;
              btn.style.opacity = '1';
            }
            return;
          }
          await loadList(false);
        } catch (error) {
          alert('Error de conexión: ' + error.message);
          if (propItem) {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.opacity = '1';
          }
        }
      });
    });
    
    document.querySelectorAll('.btn-unfeature').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        
        // Optimistic update
        const propItem = btn.closest('.prop-item');
        const originalText = btn.textContent;
        if (propItem) {
          btn.disabled = true;
          btn.textContent = 'Quitando...';
          btn.style.opacity = '0.6';
        }
        
        try {
          const res = await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
            body: JSON.stringify({ id, featured: false })
          });
          if (!res.ok) {
            const txt = await res.text().catch(() => '');
            alert('No se pudo quitar destacado: ' + txt);
            if (propItem) {
              btn.disabled = false;
              btn.textContent = originalText;
              btn.style.opacity = '1';
            }
            return;
          }
          await loadList(false);
        } catch (error) {
          alert('Error de conexión: ' + error.message);
          if (propItem) {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.opacity = '1';
          }
        }
      });
    });
  }

  // Function to handle login
  function handleLogin() {
    if (!passInput) {
      console.error('passInput no encontrado');
      return;
    }
    if (!loginBtn) {
      console.error('loginBtn no encontrado');
      return;
    }
    
    const val = passInput.value.trim();
    console.log('Intento de login, valor ingresado:', val);
    
    // Check if ADMIN_PASSWORD is available
    if (typeof ADMIN_PASSWORD === 'undefined') {
      console.error('ADMIN_PASSWORD no está definida');
      alert('Error: ADMIN_PASSWORD no está definida. Por favor, recarga la página.');
      return;
    }
    
    console.log('ADMIN_PASSWORD disponible:', ADMIN_PASSWORD);
    
    if (val === ADMIN_PASSWORD) {
      console.log('Login exitoso');
      sessionStorage.setItem('adminToken', val);
      token = val;
      if (loginError) loginError.style.display = 'none';
      if (loginCard) loginCard.style.display = 'none';
      if (content) content.style.display = 'block';
      // Hide sections by default
      if (createSection) createSection.style.display = 'none';
      if (editSection) editSection.style.display = 'none';
      if (btnCreate) btnCreate.style.opacity = '0.6';
      if (btnEdit) btnEdit.style.opacity = '0.6';
      loadList();
      loadAppointments();
    } else {
      console.log('Contraseña incorrecta. Ingresada:', val, 'Esperada:', ADMIN_PASSWORD);
      if (loginError) loginError.style.display = 'block';
    }
  }

  // Add click event to login button
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
    console.log('Event listener agregado al botón de login');
  } else {
    console.error('loginBtn no encontrado, no se puede agregar event listener');
  }

  // Add Enter key support to password input
  if (passInput) {
    passInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        handleLogin();
      }
    });
    console.log('Event listener de Enter agregado al input de contraseña');
  } else {
    console.error('passInput no encontrado, no se puede agregar event listener de Enter');
  }

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

  // Toggle between create and edit sections
  btnCreate.addEventListener('click', () => {
    createSection.classList.add('active');
    editSection.classList.remove('active');
    editSection.style.display = 'none';
    btnCreate.style.opacity = '1';
    btnEdit.style.opacity = '0.6';
  });

  btnEdit.addEventListener('click', () => {
    createSection.classList.remove('active');
    createSection.style.display = 'none';
    editSection.classList.add('active');
    editSection.style.display = 'block';
    btnCreate.style.opacity = '0.6';
    btnEdit.style.opacity = '1';
    loadEditPropertiesList();
  });

  // Load properties for editing
  async function loadEditPropertiesList() {
    editPropertiesList.innerHTML = '<div style="color:#ccc; text-align:center; padding:20px;">Cargando...</div>';
    const headers = token ? { 'x-admin-token': token } : undefined;
    const res = await fetch('/api/properties?all=1', { cache: 'no-store', headers });
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) {
      editPropertiesList.innerHTML = '<div style="color:#aaa; text-align:center; padding:20px;">No hay inmuebles para editar</div>';
      return;
    }
    editPropertiesList.innerHTML = items.map(p => `
      <div class="edit-prop-card" data-id="${p.id}">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${p.image}" alt="${p.title}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;" />
          <div style="flex:1;">
            <div style="color:#fff; font-weight:600; margin-bottom:4px;">${p.title}</div>
            <div style="color:#9ad; font-size:0.85rem;">${p.status} · ${p.price}</div>
            ${p.featured ? '<div style="color:#fbbf24; font-size:0.75rem; margin-top:4px;"><i class="fas fa-star"></i> Destacado</div>' : ''}
          </div>
        </div>
      </div>
    `).join('');
    
    editPropertiesList.querySelectorAll('.edit-prop-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        loadPropertyForEdit(id);
      });
    });
  }

  // Load property data into edit form
  async function loadPropertyForEdit(id) {
    const headers = token ? { 'x-admin-token': token } : undefined;
    const res = await fetch('/api/properties?all=1', { cache: 'no-store', headers });
    const items = await res.json();
    const property = items.find(p => String(p.id) === String(id));
    
    if (!property) {
      alert('Inmueble no encontrado');
      return;
    }
    
    document.getElementById('edit-id').value = property.id;
    document.getElementById('edit-title').value = property.title || '';
    document.getElementById('edit-price').value = property.price || '';
    document.getElementById('edit-status').value = property.status || '';
    document.getElementById('edit-image').value = (property.images && property.images.length ? property.images.join(', ') : property.image) || '';
    document.getElementById('edit-details').value = (property.details || []).join('\n');
    document.getElementById('edit-amenities').value = (property.amenities || []).join(', ');
    document.getElementById('edit-wa').value = property.whatsappText || '';
    
    editSelectView.style.display = 'none';
    editFormView.style.display = 'block';
  }

  btnBackEdit.addEventListener('click', () => {
    editFormView.style.display = 'none';
    editSelectView.style.display = 'block';
    loadEditPropertiesList();
  });

  // Upload images for edit form
  btnUploadEdit?.addEventListener('click', async () => {
    if (!editFileInput?.files?.length) {
      alert('Selecciona una o varias imágenes');
      return;
    }
    uploadMsgEdit.style.display = 'inline';
    const urls = [];
    for (const file of editFileInput.files) {
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
        uploadMsgEdit.style.display = 'none';
        alert('Error subiendo imagen');
        return;
      }
      const { url } = await res.json();
      urls.push(url);
    }
    uploadMsgEdit.style.display = 'none';
    const input = document.getElementById('edit-image');
    const existing = input.value.trim();
    input.value = [existing, ...urls].filter(Boolean).join(', ');
  });

  // Update property
  updateBtn.addEventListener('click', async () => {
    const id = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-title').value.trim();
    const price = document.getElementById('edit-price').value.trim();
    const status = document.getElementById('edit-status').value.trim().toLowerCase();
    const imageField = document.getElementById('edit-image').value.trim();
    const details = document.getElementById('edit-details').value.split('\n').map(s => s.trim()).filter(Boolean);
    const amenities = document.getElementById('edit-amenities').value.split(',').map(s => s.trim()).filter(Boolean);
    const whatsappText = document.getElementById('edit-wa').value.trim();

    if (!id || !title || !price || !status || !imageField) {
      alert('Completa título, precio, estado e imagen');
      return;
    }

    const images = imageField.split(',').map(s => s.trim()).filter(Boolean);
    const image = images[0];
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ id, title, price, status, image, images, details, amenities, whatsappText })
    });
    if (res.ok) {
      updateMsg.style.display = 'block';
      setTimeout(() => updateMsg.style.display = 'none', 2000);
      await loadList();
      await loadEditPropertiesList();
    } else {
      const txt = await res.text().catch(() => '');
      alert('Error al actualizar: ' + txt);
    }
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
      setTimeout(() => saveMsg.style.display = 'none', 2000);
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
      const txt = await res.text().catch(() => '');
      alert('Error al guardar: ' + txt);
    }
  });

  // Appointments management
  const appointmentsListEl = document.getElementById('appointments-list');
  
  async function loadAppointments(showLoading = true) {
    if (!appointmentsListEl) return;
    if (showLoading) {
      appointmentsListEl.innerHTML = '<div style="color:#ccc; text-align:center; padding:20px;">Cargando citas...</div>';
    }
    const headers = token ? { 'x-admin-token': token, 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } : { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' };
    try {
      const res = await fetch(`/api/appointments?all=1&t=${Date.now()}`, { 
        cache: 'no-store', 
        headers: headers
      });
      const items = await res.json();
      if (!Array.isArray(items) || items.length === 0) {
        appointmentsListEl.innerHTML = '<div style="color:#aaa;">No hay solicitudes de citas</div>';
        return;
      }
      
      appointmentsListEl.innerHTML = items.map(a => {
        const statusColor = {
          'pending': '#f59e0b',
          'accepted': '#10b981',
          'rejected': '#ef4444'
        }[a.status] || '#6b7280';
        const statusText = {
          'pending': 'Pendiente',
          'accepted': 'Aceptada',
          'rejected': 'Rechazada'
        }[a.status] || a.status;
        
        return `
          <div style="background:#0b0b0b; border:1px solid #1f1f1f; border-radius:12px; padding:16px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
              <div style="flex:1;">
                <div style="color:#fff; font-weight:600; font-size:1.1rem; margin-bottom:8px;">${a.name}</div>
                <div style="color:#9ad; font-size:0.9rem; margin-bottom:4px;"><i class="fas fa-envelope"></i> ${a.email}</div>
                <div style="color:#9ad; font-size:0.9rem; margin-bottom:4px;"><i class="fas fa-phone"></i> ${a.phone}</div>
                <div style="color:#9ad; font-size:0.9rem; margin-bottom:4px;"><i class="fas fa-calendar"></i> ${a.date} a las ${a.time}</div>
                ${a.property ? `<div style="color:#9ad; font-size:0.9rem; margin-bottom:4px;"><i class="fas fa-home"></i> ${a.property}</div>` : ''}
                ${a.message ? `<div style="color:#bbb; font-size:0.85rem; margin-top:8px; padding:8px; background:#161616; border-radius:6px;">${a.message}</div>` : ''}
              </div>
              <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
                <span style="background:${statusColor}20; color:${statusColor}; padding:4px 12px; border-radius:6px; font-size:0.85rem; font-weight:600; border:1px solid ${statusColor}40;">
                  ${statusText}
                </span>
                ${a.status === 'pending' ? `
                  <div style="display:flex; gap:6px; margin-top:8px;">
                    <button data-id="${a.id}" data-action="accept" class="btn" style="background:#10b981; font-size:0.85rem; padding:6px 12px;">Aceptar</button>
                    <button data-id="${a.id}" data-action="reject" class="btn" style="background:#ef4444; font-size:0.85rem; padding:6px 12px;">Rechazar</button>
                  </div>
                ` : ''}
                <button data-id="${a.id}" data-action="delete" class="btn" style="background:#6b7280; font-size:0.85rem; padding:6px 12px; margin-top:4px;">Eliminar</button>
              </div>
            </div>
            <div style="color:#666; font-size:0.75rem; margin-top:8px; border-top:1px solid #1f1f1f; padding-top:8px;">
              ID: ${a.id} | Creada: ${new Date(a.createdAt).toLocaleString('es-HN')}
            </div>
          </div>
        `;
      }).join('');
      
      // Attach event listeners
      attachAppointmentListeners();
    } catch (e) {
      appointmentsListEl.innerHTML = '<div style="color:#f88;">Error cargando citas</div>';
    }
  }
  
  function attachAppointmentListeners() {
    if (!appointmentsListEl) return;
    appointmentsListEl.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async () => {
          const appointmentId = btn.getAttribute('data-id');
          const action = btn.getAttribute('data-action');
          
          if (action === 'delete') {
            if (!confirm('¿Eliminar esta solicitud de cita?')) return;
            
            // Optimistic update
            const appointmentCard = btn.closest('div[style*="background:#0b0b0b"]');
            let originalHTML = '';
            if (appointmentCard) {
              originalHTML = appointmentCard.outerHTML;
              appointmentCard.style.transition = 'opacity 0.3s, transform 0.3s';
              appointmentCard.style.opacity = '0';
              appointmentCard.style.transform = 'translateX(-20px)';
              setTimeout(() => {
                appointmentCard.remove();
              }, 300);
            }
            
            try {
              const res = await fetch(`/api/appointments?id=${encodeURIComponent(appointmentId)}`, {
                method: 'DELETE',
                headers: { 'x-admin-token': token }
              });
              if (!res.ok) {
                alert('Error al eliminar');
                // Revertir
                if (appointmentCard && originalHTML) {
                  appointmentCard.style.opacity = '1';
                  appointmentCard.style.transform = 'translateX(0)';
                } else if (appointmentsListEl && originalHTML) {
                  appointmentsListEl.insertAdjacentHTML('beforeend', originalHTML);
                  attachAppointmentListeners();
                }
                return;
              }
              // Recargar para confirmar
              await loadAppointments(false);
            } catch (error) {
              alert('Error de conexión: ' + error.message);
              // Revertir
              if (appointmentCard && originalHTML) {
                appointmentCard.style.opacity = '1';
                appointmentCard.style.transform = 'translateX(0)';
              } else if (appointmentsListEl && originalHTML) {
                appointmentsListEl.insertAdjacentHTML('beforeend', originalHTML);
                attachAppointmentListeners();
              }
            }
          } else if (action === 'accept' || action === 'reject') {
            const status = action === 'accept' ? 'accepted' : 'rejected';
            if (!confirm(`¿${action === 'accept' ? 'Aceptar' : 'Rechazar'} esta cita?`)) return;
            
            // Optimistic update
            const appointmentCard = btn.closest('div[style*="background:#0b0b0b"]');
            const statusSpan = appointmentCard?.querySelector('span[style*="background:"]');
            const originalStatus = statusSpan?.textContent;
            const originalColor = statusSpan?.style.color;
            const originalBg = statusSpan?.style.background;
            const originalBorder = statusSpan?.style.border;
            
            if (statusSpan) {
              const newColor = status === 'accepted' ? '#10b981' : '#ef4444';
              statusSpan.textContent = status === 'accepted' ? 'Aceptada' : 'Rechazada';
              statusSpan.style.color = newColor;
              statusSpan.style.background = `${newColor}20`;
              statusSpan.style.border = `1px solid ${newColor}40`;
            }
            
            // Ocultar botones de acción
            const actionButtons = appointmentCard?.querySelector('div[style*="display:flex; gap:6px"]');
            if (actionButtons) {
              actionButtons.style.display = 'none';
            }
            btn.disabled = true;
            btn.textContent = 'Procesando...';
            
            try {
              const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
                body: JSON.stringify({ id: appointmentId, status })
              });
              if (!res.ok) {
                alert('Error al actualizar el estado');
                // Revertir
                if (statusSpan && originalStatus) {
                  statusSpan.textContent = originalStatus;
                  statusSpan.style.color = originalColor;
                  statusSpan.style.background = originalBg;
                  statusSpan.style.border = originalBorder;
                }
                if (actionButtons) actionButtons.style.display = 'flex';
                btn.disabled = false;
                btn.textContent = action === 'accept' ? 'Aceptar' : 'Rechazar';
                return;
              }
              // Recargar para confirmar
              await loadAppointments(false);
            } catch (error) {
              alert('Error de conexión: ' + error.message);
              // Revertir
              if (statusSpan && originalStatus) {
                statusSpan.textContent = originalStatus;
                statusSpan.style.color = originalColor;
                statusSpan.style.background = originalBg;
                statusSpan.style.border = originalBorder;
              }
              if (actionButtons) actionButtons.style.display = 'flex';
              btn.disabled = false;
              btn.textContent = action === 'accept' ? 'Aceptar' : 'Rechazar';
            }
          }
        });
      });
  }
  
  // Load appointments when authenticated
  const originalCheckAuth = checkAuth;
  checkAuth = function() {
    const result = originalCheckAuth();
    if (result) {
      loadAppointments();
    }
    return result;
  };

  checkAuth();
})();


