[README.md](https://github.com/user-attachments/files/21678630/README.md)
# Subasta de Vehículos — App (Back, API, Front)

Aplicación completa para gestionar subastas de vehículos. Incluye **backend** (Node.js + Express + MongoDB Atlas), **API REST**, y **frontend** (páginas para administración y para clientes que realizan pujas).

---

## 🧱 Stack
- **Backend:** Node.js, Express, Mongoose
- **Base de datos:** MongoDB Atlas
- **Frontend:** HTML, CSS, JavaScript (fetch)
- **Dev:** nodemon, morgan, dotenv, cors

---

## 📁 Estructura de carpetas
```
subasta/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env               # NO subir
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── vehiculoController.js
│   ├── models/
│   │   └── Vehiculo.js
│   └── routes/
│       └── vehiculoRoutes.js
└── frontend/
    ├── index.html         # Panel admin (CRUD)
    ├── cliente.html       # Cliente (listar + pujar)
    ├── script.js
    └── styles.css
```

---

## ⚙️ Variables de entorno (`backend/.env`)
Crea un archivo `.env` con:

```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>/<db>?retryWrites=true&w=majority
CORS_ORIGIN=http://127.0.0.1:5500
```

> **Nota:** Ajusta `CORS_ORIGIN` según el puerto/host de tu frontend. Con Live Server suele ser `http://127.0.0.1:5500` o `http://localhost:5500`.

Ejemplo de `.gitignore` (en `backend/`):
```
.env
node_modules
```

---

## 🚀 Cómo correr

### 1) Backend
```bash
cd backend
npm install
npm run dev  # nodemon server.js
```
Verás:
```
✅ Conexión a MongoDB exitosa
Servidor corriendo en http://localhost:3000
```

### 2) Frontend
- Abre el proyecto en VS Code.
- Usa la extensión **Live Server** para abrir `frontend/index.html` y `frontend/cliente.html`.
- URLs típicas:
  - Admin: `http://127.0.0.1:5500/frontend/index.html`
  - Cliente: `http://127.0.0.1:5500/frontend/cliente.html`

> El backend permite CORS para `127.0.0.1:5500` y `localhost:5500`. Ajusta en `server.js` si usas otro puerto.

---

## 🔌 API REST

**Base URL:** `http://localhost:3000/vehiculos`

### Listar vehículos
`GET /vehiculos` → 200 OK  
Respuesta: `[]` o lista de vehículos.

### Obtener por ID
`GET /vehiculos/:id` → 200 OK | 404 Not Found

### Crear vehículo (admin)
`POST /vehiculos` → 201 Created  
Body (JSON):
```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "anio": 2022,
  "precioInicial": 15000,
  "imagenUrl": "https://...",
  "fechaSubasta": "2025-08-15T12:00:00.000Z"
}
```

### Actualizar vehículo (admin)
`PUT /vehiculos/:id` → 200 OK | 404 Not Found  
Body: campos a actualizar.

### Eliminar vehículo (admin)
`DELETE /vehiculos/:id` → 200 OK | 404 Not Found

### **Pujar por un vehículo (cliente)**
`POST /vehiculos/:id/bid` → 200 OK | 409 Conflict (oferta muy baja)  
Body (JSON):
```json
{
  "postor": "Juan Pérez",
  "monto": 1200
}
```
Regla: `monto >= max(precioInicial, ofertaActual + incrementoMinimo)`.

---

## 🗃️ Modelo de datos (`Vehiculo.js`)
```js
{
  marca: String,
  modelo: String,
  anio: Number,
  precioInicial: Number,
  imagenUrl: String,
  fechaSubasta: Date,
  ofertaActual: Number,       // última puja aceptada
  postorActual: String,       // nombre del último postor
  incrementoMinimo: Number,   // salto mínimo entre pujas
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Flujo de demo (para clase)
1. **Backend**: `npm run dev` → mostrar `API funcionando` en `http://localhost:3000/`.
2. **Admin (index.html)**: crear un vehículo y verlo en la lista.
3. **Cliente (cliente.html)**: ver el vehículo, hacer una puja baja (recibir error), luego una puja válida (éxito).
4. **Postman**: `GET /vehiculos` para ver datos actualizados.
5. (Opcional) **Atlas**: mostrar documento guardado con `ofertaActual` y `postorActual`.

---

## 🛠️ Troubleshooting
- **ECONNREFUSED 127.0.0.1:3000**: backend apagado o puerto distinto. Ejecuta `npm run dev`.
- **CORS / Failed to fetch**: agrega tu host/puerto de frontend a `cors({ origin: [...] })` en `server.js`.
- **No conecta a MongoDB Atlas**: agrega tu IP en *Network Access* de Atlas y revisa usuario/clave.
- **ID inválido**: usa el `_id` de Mongo (24 caracteres hex).

---

## 📄 Licencia
Uso educativo.
