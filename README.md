<div align="center">
  <h1>🚀 PuntoNet Service Desk</h1>
  <p><strong>Mesa de Ayuda Empresarial basada en ITIL 4 con Gestión de Incidentes, Base de Conocimiento y Autenticación JWT</strong></p>
  <p>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres" />
    <img src="https://img.shields.io/badge/ITIL_4-Compliant-FF6C37?style=for-the-badge" alt="ITIL 4" />
    <img src="https://img.shields.io/github/actions/workflow/status/Alecwce/PuntoNet-Desk/ci.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white&label=CI%20Pipeline" alt="CI Status" />
  </p>
</div>

---

## 📌 Descripción General

**PuntoNet Service Desk** es una plataforma integral de Mesa de Ayuda diseñada bajo estándares y principios de **ITIL 4**. Permite centralizar la recepción, priorización, asignación y resolución de incidencias y requerimientos operativos, integrando autenticación por roles (RBAC), base de conocimiento autoservicio y métricas de rendimiento en tiempo real.

---

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

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Desarrollado con ❤️ por el equipo de PuntoNet
