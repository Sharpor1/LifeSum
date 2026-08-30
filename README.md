# LifeSum

**LifeSum** es un gestor de proyectos y de vida pensado para personas que no conocen metodologías ágiles. Con una interfaz amigable y sencilla, te permite organizar tus actividades diarias, semanales y de largo plazo, priorizarlas, seguirlas con logros y personalizar tu espacio de trabajo.

## ✨ Características

- **Proyectos** organizados con color, emoji y descripción.
- **Actividades** dentro de cada proyecto, con:
  - Regularidad: regular, semestral (semi) o única.
  - Día de la semana y hora programada.
  - Prioridad (alta, media, baja) y color de nota.
  - Semanas programadas y objetivos de completación (para actividades semestrales).
- **Logros** por proyecto o por actividad, con iconos y metas (conteo o cantidad).
- **Registro de completaciones** por día y racha (streak).
- **Stickers** decorativos y **stickers personalizados** (imágenes propias).
- **Fondos de pantalla personalizados** (sube tu propia imagen).
- **Personalización completa**: tema oscuro, color de acento, color/transparencia de tarjetas, tamaño de fuente, avisos e impresión.
- **Notificaciones** de recordatorio.
- **Autenticación por nombre** sin registro: no necesitas contraseña, la cuenta se crea automáticamente.

## 🧱 Stack tecnológico

| Capa       | Tecnología                                                        |
|------------|-------------------------------------------------------------------|
| Frontend   | React 18, Vite 6, TypeScript, Tailwind CSS 4, React Router 7      |
| Backend    | Node.js, Express 4, TypeScript                                    |
| Base de datos | SQLite (`better-sqlite3`)                                       |
| Subida de archivos | Multer (fondos de pantalla)                               |
| Otros      | Lucide (iconos), Motion (animaciones), Sonner (notificaciones)    |

## 📁 Estructura del proyecto

```
LifeSum/
├── frontEnd/          # Aplicación React (Vite)
│   └── src/app/       # Lógica, componentes y API client
├── backEnd/           # API REST (Express + SQLite)
│   └── src/routes/    # Endpoints por recurso
└── package.json       # Scripts orquestadores del monorepo
```

- **Frontend dev server:** `http://localhost:5173`
- **Backend API:** `http://localhost:3001`

El frontend usa un *proxy* en Vite (`/api` y `/uploads`) que redirige al backend, por lo que en desarrollo no necesitas configurar URLs.

## 🚀 Cómo ejecutarlo

### Requisitos previos

- **Node.js** 18 o superior (incluye `npm`).
- **Git** (opcional, para clonar).

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd LifeSum
```

### 2. Instalar dependencias

Desde la raíz del proyecto, instala todo (frontend y backend) con un solo comando:

```bash
npm run install:all
```

o, si lo prefieres, por separado:

```bash
npm --prefix frontEnd install
npm --prefix backEnd install
```

### 3. Ejecutar en desarrollo

Desde la raíz, lanza **frontend y backend a la vez**:

```bash
npm run dev
```

También puedes lanzarlos en terminales separadas:

```bash
npm run dev:back    # Backend en http://localhost:3001
npm run dev:front   # Frontend en http://localhost:5173
```

Abre **http://localhost:5173** en tu navegador, escribe tu nombre en la pantalla de inicio y ¡listo!

> La base de datos SQLite se crea automáticamente en `backEnd/data/lifesum.db` la primera vez que arranca el backend. No necesitas ejecutar migraciones manualmente.

### 4. Build de producción

```bash
npm run build:all     # Compila frontend + backend
```

Luego inicia solo el backend (que también sirve el frontend compilado si está configurado así):

```bash
npm start
```

### Verificación de tipos

```bash
npm run typecheck     # frontend y backend
```

## 🔐 Autenticación

- Inicias sesión **solo con tu nombre**, sin contraseña.
- La cuenta es temporal: mientras tengas la página abierta se mantiene activa; tras unos minutos de inactividad se elimina automáticamente junto con sus datos.
- Cada sesión guarda un token de acceso en `localStorage` del navegador.

## 📡 API (resumen)

| Método | Endpoint                   | Descripción                                  |
|--------|----------------------------|-----------------------------------------------|
| POST   | `/api/auth/login`          | Inicia sesión por nombre (devuelve token).    |
| POST   | `/api/auth/heartbeat`      | Renueva la expiración de la cuenta.           |
| GET    | `/api/projects`            | Lista los proyectos del usuario.              |
| POST   | `/api/projects`            | Crea un proyecto.                             |
| PUT    | `/api/projects/:id`        | Actualiza un proyecto.                        |
| DELETE | `/api/projects/:id`        | Elimina un proyecto.                          |
| GET    | `/api/stickers`            | Lista stickers decorativos.                   |
| PUT    | `/api/stickers/batch`      | Sincroniza stickers.                          |
| POST   | `/api/completions`         | Registra una completación.                    |
| GET    | `/api/completions/streak`  | Devuelve la racha actual.                     |
| POST   | `/api/backgrounds/upload`  | Sube un fondo de pantalla (multipart).        |
| GET    | `/api/backgrounds`         | Lista los fondos subidos.                     |
| DELETE | `/api/backgrounds/:id`     | Elimina un fondo.                             |
| GET    | `/api/custom-stickers`     | Lista stickers personalizados.                |

Para más detalle, revisa `backEnd/src/apiDocs.ts` y las rutas en `backEnd/src/routes/`.

## 📄 Licencia

Proyecto personal de portafolio. Sin licencia específica.
