# PuntoNet Service Desk 🚀

Un sistema moderno de Mesa de Ayuda (Service Desk) diseñado para optimizar la gestión de tickets, clientes y base de conocimientos, siguiendo principios de ITIL 4.

## ✨ Características Principales

### 🔐 Autenticación y Seguridad

- Login seguro con JWT
- Autenticación de dos factores (2FA)
- Control de acceso basado en roles (RBAC): **Admin**, **Agente**, **Cliente**
- Rutas protegidas con validación de permisos
- Hash de contraseñas con bcrypt

### 🎫 Gestión Avanzada de Tickets

- **CRUD completo** de tickets con validación
- **Sistema de prioridades**: Baja, Media, Alta, Crítica (traducido al español)
- **Estados de ticket**: Abierto, En Progreso, Resuelto, Cerrado
- **Chat interno** por ticket con historial de mensajes
- **Adjuntos de archivos** (imágenes, documentos, PDFs)
- **Asignación de tickets** a agentes
- **Dashboard interactivo** con:
  - KPIs en tiempo real
  - Gráficos de actividad semanal
  - Estado del sistema
  - Accesos rápidos funcionales
  - Tabla de tickets recientes

### 👥 Gestión de Clientes

- CRUD completo de clientes
- Información de contacto y empresa
- Modal de creación rápida desde Dashboard
- Visualización de tickets por cliente

### 📚 Base de Conocimientos

- Artículos de ayuda organizados por categorías
- Sistema de búsqueda y filtrado
- Integración en detalle de tickets con artículos sugeridos
- Creación y edición de artículos con Markdown

### 📊 Módulo de Reportes (Admin)

- Estadísticas de tickets por estado
- Métricas de rendimiento de agentes
- Tiempo promedio de resolución
- Filtros por fecha y estado

### 🎨 UI/UX Moderna

- **Diseño completamente responsivo**
- **Modo Oscuro/Claro** con persistencia
- Interfaz construida con **Tailwind CSS**
- Íconos con **Material Symbols**
- Gráficos interactivos con **Recharts**
- Animaciones fluidas y micro-interacciones
- Glassmorphism en componentes clave

## 🛠️ Stack Tecnológico

### Frontend

- **React 18** (Vite) - Framework UI de alto rendimiento
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de estilos utilitarios
- **Axios** - Cliente HTTP con interceptores
- **Recharts** - Gráficos y visualizaciones
- **React Router** - Navegación SPA

### Backend

- **Node.js & Express** - Servidor API RESTful
- **Prisma ORM** - Gestión moderna de base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **bcrypt** - Hash de contraseñas
- **Multer** - Gestión de uploads de archivos

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** v18 o superior
- **PostgreSQL** v14 o superior
- **npm** o **yarn**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Alecwce/PuntoNet-Desk.git
cd PuntoNet-Desk
```

### 2. Configurar el Backend

```bash
cd server
npm install

# Crear archivo .env en /server con:
# DATABASE_URL="postgresql://usuario:password@localhost:5432/puntonet_desk?schema=public"
# JWT_SECRET="tu_secreto_super_seguro_aqui"
# PORT=3001

# Ejecutar migraciones de base de datos
npx prisma migrate dev --name init

# Generar cliente de Prisma
npx prisma generate

# (Opcional) Poblar base de datos con datos de prueba
npm run seed

# Iniciar servidor de desarrollo
npm run dev
```

### 3. Configurar el Frontend

```bash
# Desde la raíz del proyecto
npm install

# Crear archivo .env (opcional):
# VITE_API_URL=http://localhost:3001/api

# Iniciar aplicación
npm run dev
```

La aplicación estará disponible en:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Prisma Studio**: http://localhost:5555 (ejecuta `npx prisma studio` en /server)

## 🧪 Usuarios de Prueba

Después de ejecutar el seed, usa estas credenciales:

| Rol         | Email                | Contraseña | Permisos                        |
| ----------- | -------------------- | ---------- | ------------------------------- |
| **Admin**   | admin@puntonet.com   | admin123   | Acceso total al sistema         |
| **Agente**  | agente@puntonet.com  | agente123  | Gestión de tickets y clientes   |
| **Cliente** | cliente@puntonet.com | cliente123 | Ver y crear sus propios tickets |

## 📁 Estructura del Proyecto

```
PuntoNet-Desk/
├── server/                  # Backend
│   ├── prisma/             # Esquemas y migraciones
│   ├── src/
│   │   ├── routes/         # Rutas de la API
│   │   ├── middleware/     # Middleware (auth, etc.)
│   │   └── index.ts        # Punto de entrada
│   └── uploads/            # Archivos subidos
├── src/                    # Frontend
│   ├── components/         # Componentes reutilizables
│   ├── views/              # Vistas principales
│   ├── lib/                # Utilidades (api, etc.)
│   └── types/              # Definiciones TypeScript
└── public/                 # Recursos estáticos
```

## 🔄 Funcionalidades Recientes

- ✅ Traducción completa de la interfaz al español
- ✅ Integración de Base de Conocimiento en tickets
- ✅ Sistema de adjuntos de archivos
- ✅ Dashboard con acciones rápidas funcionales
- ✅ Módulo de Clientes completo
- ✅ Módulo de Reportes para administradores
- ✅ Modo oscuro mejorado con mejor contraste
- ✅ Chat en tiempo real por ticket

## 🎯 Próximas Características

- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Exportación de reportes a PDF/Excel
- [ ] Sistema de plantillas para respuestas
- [ ] SLA (Service Level Agreements)
- [ ] Integración con correo electrónico
- [ ] Panel de métricas avanzadas

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- El proyecto usa **Prisma** como ORM, revisa `server/prisma/schema.prisma` para el modelo de datos
- Las traducciones están integradas directamente en los componentes
- Para modo oscuro, se usa la clase `dark:` de Tailwind
- Los archivos se almacenan en `server/uploads/`

## 🚀 Despliegue (Deployment)

Esta aplicación está configurada para desplegarse fácilmente en el stack moderno gratuito:

- **Frontend**: [Vercel](https://vercel.com)
- **Backend**: [Railway](https://railway.app)
- **Base de Datos**: [Neon](https://neon.tech) (PostgreSQL)
- **Archivos**: [Cloudinary](https://cloudinary.com)

### 1. Configuración de Base de Datos (Neon)

1. Crear proyecto en Neon.
2. Obtener connection string (`DATABASE_URL`).
3. Neon requiere `sslmode=require` y soporta `DIRECT_URL` para migraciones.

### 2. Configuración de Archivos (Cloudinary)

1. Crear cuenta en Cloudinary.
2. Obtener `Cloud Name`, `API Key` y `API Secret`.

### 3. Backend (Railway)

1. Conectar repositorio GitHub a Railway.
2. Configurar variables de entorno (ver `server/.env.example`).
3. El proyecto detectará automáticamente `railway.json` y usará Nixpacks.
4. **Build Command**: `cd server && npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
5. **Start Command**: `cd server && npm start`

### 4. Frontend (Vercel)

1. Importar proyecto a Vercel.
2. Configurar variable de entorno: `VITE_API_URL` (URL de tu backend en Railway).
3. Vercel detectará `vercel.json` y usará `dist` como directorio de salida.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Desarrollado con ❤️ por el equipo de PuntoNet
