
const API = 'http://localhost:3000/vehiculos';
const REQUEST_TIMEOUT_MS = 8000;


const fmtCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const $ = (sel, root = document) => root.querySelector(sel);

function withTimeout(promiseFactory, ms = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  const exec = (async () => {
    try {
      const res = await promiseFactory(controller.signal);
      return res;
    } finally {
      clearTimeout(t);
    }
  })();
  return { exec, controller };
}

async function httpGet(url) {
  const { exec } = withTimeout(async (signal) => {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Error al cargar datos');
    return res.json();
  });
  return exec;
}

async function httpPost(url, body) {
  const { exec } = withTimeout(async (signal) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.mensaje || 'No se pudo completar la operación');
    return data;
  });
  return exec;
}

function setLoading(on) {
  $('#loading').hidden = !on;
  $('#list').hidden = on;
  $('#empty').hidden = true;
}

function announce(msg) {
  const fb = $('#feedback');
  if (fb) fb.textContent = msg;
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


function calcMinimo(v) {
  const inc = (v.incrementoMinimo ?? 100);
  if (v.ofertaActual && v.ofertaActual > 0) return v.ofertaActual + inc;
  return Math.max(v.precioInicial ?? 0, 0);
}

function renderVehiculos(vehiculos) {
  const list = $('#list');
  list.innerHTML = '';

  if (!vehiculos || vehiculos.length === 0) {
    $('#empty').hidden = false;
    list.hidden = true;
    return;
  }

  $('#empty').hidden = true;
  list.hidden = false;

  vehiculos.forEach((v, idx) => {
    const minimo = calcMinimo(v);
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('aria-labelledby', `veh-${idx}-title`);
    card.innerHTML = `
      <div class="veh-title" id="veh-${idx}-title">${escapeHtml(v.marca)} ${escapeHtml(v.modelo)} <span class="muted">(${escapeHtml(v.anio)})</span></div>
      <div class="muted">Precio base: <strong>${fmtCOP.format(v.precioInicial ?? 0)}</strong></div>
      <div class="muted">Oferta actual: <strong>${fmtCOP.format(v.ofertaActual ?? 0)}</strong> ${v.postorActual ? `<span class="muted">(postor: ${escapeHtml(v.postorActual)})</span>` : ''}</div>
      <div class="muted">Incremento mínimo: <strong>${fmtCOP.format(v.incrementoMinimo ?? 100)}</strong></div>

      <form class="row" novalidate>
        <div>
          <label for="nombre-${idx}">Tu nombre</label>
          <input id="nombre-${idx}" name="postor" type="text" placeholder="Escribe tu nombre" autocomplete="name" required />
        </div>

        <div>
          <label for="monto-${idx}">Monto de la puja</label>
          <input id="monto-${idx}" name="monto" type="number" min="${minimo}" step="1" value="${minimo}" inputmode="numeric" />
          <small class="muted">Mínimo: ${fmtCOP.format(minimo)}</small>
        </div>

        <div class="actions">
          <button type="submit" class="btn-pujar" data-id="${v.id || v._id}">Pujar</button>
          <span class="status muted" aria-live="polite"></span>
        </div>
      </form>
    `;
    list.appendChild(card);

    const form = card.querySelector('form');
    const btn = card.querySelector('.btn-pujar');
    const nombreEl = card.querySelector('#nombre-' + idx);
    const montoEl = card.querySelector('#monto-' + idx);
    const status = card.querySelector('.status');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.className = 'status muted';

      const postor = nombreEl.value.trim();
      const monto = Number(montoEl.value);

      if (!postor) {
        status.textContent = 'Por favor, ingresa tu nombre.';
        status.className = 'status err';
        nombreEl.focus();
        return;
      }
      if (!Number.isFinite(monto) || monto <= 0) {
        status.textContent = 'Monto inválido.';
        status.className = 'status err';
        montoEl.focus();
        return;
      }
      if (monto < Number(montoEl.min)) {
        status.textContent = `La puja debe ser al menos de ${fmtCOP.format(Number(montoEl.min))}.`;
        status.className = 'status err';
        montoEl.focus();
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Enviando…';

      try {
        await httpPost(`${API}/${btn.dataset.id}/bid`, { monto, postor });
        status.textContent = 'Oferta aceptada ✅';
        status.className = 'status ok';
        announce(`Oferta aceptada para ${v.marca} ${v.modelo} por ${postor}.`);
        await loadVehiculos(); 
      } catch (err) {
        const msg = (err?.message || '').includes('Oferta muy baja')
          ? err.message
          : (err?.message || 'No se pudo pujar');
        status.textContent = msg;
        status.className = 'status err';
        announce(`Error: ${msg}`);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Pujar';
      }
    });
  });
}


async function loadVehiculos(retry = 1) {
  setLoading(true);
  try {
    const data = await httpGet(API);
    setLoading(false);
    renderVehiculos(Array.isArray(data) ? data : []);
  } catch (err) {
    if (retry > 0) {
      await new Promise(r => setTimeout(r, 600));
      return loadVehiculos(retry - 1);
    }
    setLoading(false);
    const list = $('#list');
    list.hidden = true;
    const empty = $('#empty');
    empty.hidden = false;
    empty.textContent = 'No se pudieron cargar los vehículos. Verifica el servidor y vuelve a intentarlo.';
  }
}


(async function init() {
  await loadVehiculos();
})();
