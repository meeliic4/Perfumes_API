# 🌸 Perfumería API

API REST construida con **Node.js + Express + MySQL** para el sistema de gestión de perfumería.

---

## 🚀 Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# 3. Importar la base de datos
mysql -u root -p < perfumeria_db_v4.sql

# 4. Iniciar el servidor
npm start          # producción
npm run dev        # desarrollo (con nodemon)
```

---

## 📋 Variables de entorno (`.env`)

| Variable      | Descripción              | Default        |
|---------------|--------------------------|----------------|
| `DB_HOST`     | Host de MySQL            | `localhost`    |
| `DB_PORT`     | Puerto de MySQL          | `3306`         |
| `DB_USER`     | Usuario de MySQL         | `root`         |
| `DB_PASSWORD` | Contraseña de MySQL      | *(vacío)*      |
| `DB_NAME`     | Nombre de la base        | `perfumeria_db`|
| `PORT`        | Puerto del servidor      | `3000`         |

---

## 🗺️ Endpoints

### 🔍 Health Check
| Método | Ruta          | Descripción                    |
|--------|---------------|--------------------------------|
| GET    | `/api/health` | Verifica conexión a la base de datos |

---

### 📂 Categorías — `/api/categorias`
| Método | Ruta               | Descripción           |
|--------|--------------------|-----------------------|
| GET    | `/`                | Listar todas          |
| GET    | `/:id`             | Obtener una           |
| POST   | `/`                | Crear nueva           |
| PUT    | `/:id`             | Actualizar            |
| DELETE | `/:id`             | Eliminar              |

**Body POST/PUT:**
```json
{ "nombre": "Perfumes Masculinos", "descripcion": "..." }
```

---

### 🏷️ Marcas — `/api/marcas`
| Método | Ruta   | Descripción |
|--------|--------|-------------|
| GET    | `/`    | Listar todas |
| GET    | `/:id` | Obtener una  |
| POST   | `/`    | Crear nueva  |
| PUT    | `/:id` | Actualizar   |
| DELETE | `/:id` | Eliminar     |

**Body POST/PUT:**
```json
{ "nombre": "Chanel", "pais_origen": "Francia", "descripcion": "..." }
```

---

### 🧴 Productos — `/api/productos`
| Método | Ruta             | Descripción                  |
|--------|------------------|------------------------------|
| GET    | `/`              | Listar (con filtros)         |
| GET    | `/:id`           | Obtener uno                  |
| POST   | `/`              | Crear nuevo                  |
| PUT    | `/:id`           | Actualizar                   |
| PATCH  | `/:id/stock`     | Ajustar stock (+/-)          |
| DELETE | `/:id`           | Eliminar                     |

**Filtros en GET `/`:**
```
?categoria=1 &marca=2 &concentracion=EDP &minPrecio=1000 &maxPrecio=3000
```

**Body POST/PUT:**
```json
{
  "nombre": "Chanel Nº5",
  "precio": 3200.00,
  "stock": 25,
  "volumen_ml": 50,
  "concentracion": "EDP",
  "id_categoria": 2,
  "id_marca": 1
}
```
`concentracion` acepta: `EDC | EDT | EDP | Parfum | Colonia`

**Body PATCH `/stock`:**
```json
{ "cantidad": -3 }   // negativo = restar, positivo = sumar
```

---

### 👤 Clientes — `/api/clientes`
| Método | Ruta              | Descripción               |
|--------|-------------------|---------------------------|
| GET    | `/`               | Listar todos              |
| GET    | `/:id`            | Obtener uno               |
| GET    | `/:id/pedidos`    | Pedidos del cliente       |
| POST   | `/`               | Crear nuevo               |
| PUT    | `/:id`            | Actualizar                |
| DELETE | `/:id`            | Eliminar                  |

**Body POST/PUT:**
```json
{
  "nombre": "Sofía",
  "apellido": "Ramírez",
  "email": "sofia@email.com",
  "telefono": "8711234567"
}
```

---

### 📦 Pedidos — `/api/pedidos`
| Método | Ruta                        | Descripción                    |
|--------|-----------------------------|--------------------------------|
| GET    | `/`                         | Listar (con filtros)           |
| GET    | `/:id`                      | Obtener con detalles           |
| POST   | `/`                         | Crear pedido completo          |
| PATCH  | `/:id/estado`               | Cambiar estado                 |
| DELETE | `/:id`                      | Eliminar                       |
| POST   | `/:id/detalles`             | Agregar producto al pedido     |
| DELETE | `/:id/detalles/:idDetalle`  | Quitar producto del pedido     |

**Filtros en GET `/`:**
```
?estado=pendiente &clienteId=1
```
`estado` acepta: `pendiente | confirmado | enviado | entregado | cancelado`

**Body POST (crear pedido):**
```json
{
  "id_cliente": 1,
  "items": [
    { "id_producto": 1, "cantidad": 1, "precio_unitario": 3200.00 },
    { "id_producto": 5, "cantidad": 2, "precio_unitario": 1950.00 }
  ]
}
```
> ⚡ Los triggers de la BD calculan `subtotal` y `total` automáticamente.

**Body PATCH `/estado`:**
```json
{ "estado": "enviado" }
```

**Body POST `/:id/detalles`:**
```json
{ "id_producto": 3, "cantidad": 1, "precio_unitario": 2650.00 }
```

---

### 📊 Reportes — `/api/reportes`
| Método | Ruta              | Descripción                        |
|--------|-------------------|------------------------------------|
| GET    | `/resumen`        | Totales generales del sistema      |
| GET    | `/top-productos`  | Productos más vendidos (`?limit=5`)|
| GET    | `/ventas-mes`     | Ventas agrupadas por mes           |
| GET    | `/stock-bajo`     | Productos con stock bajo (`?umbral=20`) |

---

## 🏗️ Estructura del proyecto

```
perfumeria-api/
├── src/
│   ├── index.js                  # Entrada principal
│   ├── db.js                     # Pool de conexiones MySQL
│   ├── controllers/
│   │   ├── categorias.js
│   │   ├── marcas.js
│   │   ├── productos.js
│   │   ├── clientes.js
│   │   ├── pedidos.js
│   │   └── reportes.js
│   ├── routes/
│   │   ├── categorias.js
│   │   ├── marcas.js
│   │   ├── productos.js
│   │   ├── clientes.js
│   │   ├── pedidos.js
│   │   └── reportes.js
│   └── middleware/
│       ├── errorHandler.js       # Manejo global de errores
│       └── validate.js           # Validación de inputs
├── .env.example
├── package.json
└── README.md
```

---

## ⚠️ Manejo de errores

Todos los errores devuelven JSON con la clave `error`:

| Código | Caso                                    |
|--------|-----------------------------------------|
| 400    | Datos inválidos / validación fallida    |
| 404    | Recurso no encontrado                   |
| 409    | Duplicado o FK violada                  |
| 500    | Error interno del servidor              |

---

## 🛠️ Tecnologías

- **Node.js** + **Express 4**
- **mysql2** (con pool de conexiones y Promises)
- **express-validator** para validación de inputs
- **dotenv** para configuración por entorno
