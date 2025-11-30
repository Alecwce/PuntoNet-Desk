# PuntoNet Service Desk 🚀

Un sistema moderno de Mesa de Ayuda (Service Desk) diseñado para optimizar la gestión de tickets, usuarios y base de conocimientos, siguiendo principios de ITIL 4.

![Dashboard Preview](https://raw.githubusercontent.com/Alecwce/PuntoNet-Desk/main/screenshots/dashboard.png)
_(Nota: Asegúrate de subir capturas de pantalla a una carpeta 'screenshots' para que se vean aquí)_

## ✨ Características Principales

- **🔐 Autenticación Segura & RBAC:**

  - Login con 2FA (Simulado para demo).
  - Roles definidos: **Administrador**, **Agente**, **Cliente**.
  - Rutas protegidas y vistas adaptativas según el rol.

- **🎫 Gestión de Tickets:**

  - Creación, edición y seguimiento de tickets.
  - Asignación de prioridades (Baja, Media, Alta, Crítica) y estados.
  - Chat en tiempo real dentro de cada ticket.

- **👥 Gestión de Usuarios (Admin):**

  - CRUD completo de usuarios.
  - Asignación de roles y avatares.
  - Eliminación segura con limpieza de datos en cascada.

- **📚 Base de Conocimientos:**

  - Artículos de ayuda para auto-servicio.
  - Búsqueda y filtrado (Próximamente).

- **🎨 UI/UX Moderna:**
  - Diseño responsivo y "Glassmorphism".
  - Modo Oscuro/Claro (preparado).
  - Interfaz intuitiva construida con Tailwind CSS.

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React** (Vite) - Framework UI.
- **TypeScript** - Tipado estático para robustez.
- **Tailwind CSS** - Estilos utilitarios y diseño moderno.
- **Axios** - Cliente HTTP.
- **Lucide React** - Iconografía.

### Backend

- **Node.js & Express** - Servidor API RESTful.
- **Prisma ORM** - Gestión de base de datos.
- **PostgreSQL** - Base de datos relacional.
- **JWT** - Manejo de sesiones (Estructura lista).

## 🚀 Instalación y Configuración

Sigue estos pasos para desplegar el proyecto localmente.

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL instalado y corriendo

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Alecwce/PuntoNet-Desk.git
cd PuntoNet-Desk
```

### 2. Configurar el Backend

```bash
cd server
npm install

# Configura tus variables de entorno
# Crea un archivo .env en /server con:
# DATABASE_URL="postgresql://usuario:password@localhost:5432/puntonet_desk?schema=public"
# JWT_SECRET="tu_secreto_super_seguro"

# Inicializar Base de Datos
npx prisma migrate dev --name init
npx prisma db seed # (Opcional: para datos de prueba)

# Iniciar Servidor
npm run dev
```

### 3. Configurar el Frontend

```bash
# En una nueva terminal, desde la raíz del proyecto
npm install

# Iniciar Cliente
npm run dev
```

El frontend correrá en `http://localhost:5173` y el backend en `http://localhost:3001`.

## 🧪 Usuarios de Prueba (Seed)

Si ejecutaste el seed, puedes usar estas credenciales:

| Rol         | Email                | Contraseña |
| ----------- | -------------------- | ---------- |
| **Admin**   | admin@puntonet.com   | admin123   |
| **Agente**  | agente@puntonet.com  | agente123  |
| **Cliente** | cliente@puntonet.com | cliente123 |

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o envía un Pull Request para mejoras.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
