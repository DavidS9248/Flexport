const API = 'http://localhost:3000/vehiculos';

const form = document.getElementById('vehiculoForm');
const lista = document.getElementById('lista');
const cancelarBtn = document.getElementById('cancelarEdicion');
const vehiculoIdHidden = document.getElementById('vehiculoId');

function toISO(dtLocal) {
  
  if (!dtLocal) return undefined;
  const d = new Date(dtLocal);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

async function listar() {
  lista.innerHTML = '<li class="muted">Cargando…</li>';
  try {
    const res = await fetch(API);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Respuesta inesperada');

    if (data.length === 0) {
      lista.innerHTML = '<li class="muted">No hay vehículos aún</li>';
      return;
    }

    lista.innerHTML = '';
    data.forEach(v => {
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `
        <div class="item-main">
          <div>
            <strong>${v.marca} ${v.modelo}</strong> (${v.anio}) — $${v.precioInicial}
            ${v.fechaSubasta ? `<div class="muted small">Subasta: ${new Date(v.fechaSubasta).toLocaleString()}</div>` : ''}
          </div>
          <div class="item-actions">
            ${v.imagenUrl ? `<a href="${v.imagenUrl}" target="_blank">Imagen</a>` : ''}
            <button class="edit" data-id="${v.id || v._id}">Editar</button>
            <button class="del" data-id="${v.id || v._id}">Eliminar</button>
          </div>
        </div>
      `;
      lista.appendChild(li);
    });
  } catch (e) {
    console.error(e);
    lista.innerHTML = '<li class="error">Error cargando lista</li>';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const body = Object.fromEntries(fd.entries());
  body.anio = Number(body.anio);
  body.precioInicial = Number(body.precioInicial);

  
  if (body.fechaSubasta) body.fechaSubasta = toISO(body.fechaSubasta);
  if (!body.fechaSubasta) delete body.fechaSubasta;
  if (!body.imagenUrl) delete body.imagenUrl;

  const id = vehiculoIdHidden.value.trim();

  try {
    const res = await fetch(id ? `${API}/${id}` : API, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.mensaje || 'Error en la solicitud');
    }
    form.reset();
    vehiculoIdHidden.value = '';
    cancelarBtn.hidden = true;
    await listar();
  } catch (e) {
    alert(e.message || 'Error al guardar');
  }
});

lista.addEventListener('click', async (e) => {
  
  if (e.target.classList.contains('del')) {
    const id = e.target.getAttribute('data-id');
    if (!confirm('¿Eliminar vehículo?')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar');
      await listar();
    } catch (err) {
      alert(err.message);
    }
  }

  
  if (e.target.classList.contains('edit')) {
    const id = e.target.getAttribute('data-id');
    try {
      const res = await fetch(`${API}/${id}`);
      const v = await res.json();
      if (!res.ok) throw new Error(v.error || 'No se pudo cargar el vehículo');

      form.marca.value = v.marca || '';
      form.modelo.value = v.modelo || '';
      form.anio.value = v.anio || '';
      form.precioInicial.value = v.precioInicial || '';
      form.imagenUrl.value = v.imagenUrl || '';
      form.fechaSubasta.value = v.fechaSubasta
        ? new Date(v.fechaSubasta).toISOString().slice(0,16)
        : '';

      vehiculoIdHidden.value = v.id || v._id;
      cancelarBtn.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(err.message || 'Error cargando vehículo');
    }
  }
});

cancelarBtn.addEventListener('click', () => {
  form.reset();
  vehiculoIdHidden.value = '';
  cancelarBtn.hidden = true;
});

listar();
