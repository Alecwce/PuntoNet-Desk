# 🗄️ Guía Completa: Acceso a PostgreSQL - PuntoNet Desk

## 📊 **Información de tu Base de Datos**

### Conexión:

- **Host**: `localhost`
- **Puerto**: `5432`
- **Base de datos**: `puntonet_desk`
- **Usuario**: `postgres`
- **Contraseña**: `123456`

### Tablas Disponibles:

1. **User** - Usuarios del sistema (1 registro) ✅
2. **Ticket** - Tickets/solicitudes (0 registros)
3. **Message** - Mensajes de tickets (0 registros)
4. **KnowledgeBase** - Base de conocimientos (0 registros)

---

## 🎯 **Opción 1: Prisma Studio (RECOMENDADO - MÁS FÁCIL)**

### Iniciar Prisma Studio:

```bash
cd server
npx prisma studio
```

### Acceder:

Abre tu navegador en: **http://localhost:5555**

### Características:

- ✅ **Interfaz visual** para ver y editar datos
- ✅ **No necesitas escribir SQL**
- ✅ **Agregar, editar, eliminar registros** con clics
- ✅ **Ver relaciones** entre tablas

### Cómo usar:

1. Haz clic en el nombre de una tabla (ej: **User**)
2. Verás todos los registros en formato tabla
3. **Add record** - Agregar nuevo registro
4. **Editar** - Doble clic en la celda
5. **Eliminar** - Seleccionar y presionar Delete

---

## 🖥️ **Opción 2: Script Node.js (Ver Datos en Consola)**

### Ejecutar el script:

```bash
cd server
node view-database.js
```

Este script muestra:

- 👥 Lista de usuarios
- 🎫 Lista de tickets
- 💬 Últimos mensajes
- 📚 Artículos de conocimiento
- 📈 Resumen total

---

## 💻 **Opción 3: pgAdmin (GUI Profesional)**

### Descargar e Instalar:

1. Descarga desde: https://www.pgadmin.org/download/
2. Instala pgAdmin 4

### Conectar:

1. Abre pgAdmin
2. Click derecho en "Servers" → "Register" → "Server"
3. Llena los datos:
   - **Name**: PuntoNet Desk
   - **Host**: localhost
   - **Port**: 5432
   - **Database**: puntonet_desk
   - **Username**: postgres
   - **Password**: 123456

### Ventajas:

- ✅ Interfaz muy completa
- ✅ Ejecutar consultas SQL personalizadas
- ✅ Ver estructuras de tablas
- ✅ Exportar/importar datos
- ✅ Gestión completa de PostgreSQL

---

## 🔧 **Opción 4: Terminal PostgreSQL (psql)**

### Conectar desde terminal:

```bash
psql -U postgres -d puntonet_desk
```

### Comandos útiles:

```sql
-- Ver todas las tablas
\dt

-- Ver datos de User
SELECT * FROM "User";

-- Ver datos de Ticket
SELECT * FROM "Ticket";

-- Ver datos de Message
SELECT * FROM "Message";

-- Ver datos de KnowledgeBase
SELECT * FROM "KnowledgeBase";

-- Contar registros por tabla
SELECT 'Users' as tabla, COUNT(*) FROM "User"
UNION ALL
SELECT 'Tickets', COUNT(*) FROM "Ticket"
UNION ALL
SELECT 'Messages', COUNT(*) FROM "Message"
UNION ALL
SELECT 'KnowledgeBase', COUNT(*) FROM "KnowledgeBase";

-- Ver estructura de una tabla
\d "User"

-- Salir
\q
```

---

## 📝 **Opción 5: DBeaver (Gratis y Potente)**

### Descargar:

https://dbeaver.io/download/

### Ventajas:

- ✅ Gratis y open source
- ✅ Soporta múltiples bases de datos
- ✅ Editor SQL con autocompletado
- ✅ Diagramas ER automáticos
- ✅ Exportación a múltiples formatos

---

## 🔍 **Consultas SQL Útiles para PuntoNet Desk**

### Ver usuarios con sus tickets:

```sql
SELECT
  u.name,
  u.email,
  u.role,
  COUNT(t.id) as total_tickets
FROM "User" u
LEFT JOIN "Ticket" t ON t."creatorId" = u.id
GROUP BY u.id, u.name, u.email, u.role;
```

### Ver tickets con estado y asignado:

```sql
SELECT
  t.subject,
  t.status,
  t.priority,
  creator.name as "creado_por",
  assignee.name as "asignado_a",
  COUNT(m.id) as total_mensajes
FROM "Ticket" t
INNER JOIN "User" creator ON t."creatorId" = creator.id
LEFT JOIN "User" assignee ON t."assigneeId" = assignee.id
LEFT JOIN "Message" m ON m."ticketId" = t.id
GROUP BY t.id, t.subject, t.status, t.priority, creator.name, assignee.name;
```

### Ver mensajes de un ticket específico:

```sql
SELECT
  m.content,
  u.name as "enviado_por",
  m."createdAt"
FROM "Message" m
INNER JOIN "User" u ON m."senderId" = u.id
WHERE m."ticketId" = 'ID_DEL_TICKET'
ORDER BY m."createdAt" ASC;
```

---

## 🎯 **Recomendación Personal**

Para desarrollo diario:

1. **Prisma Studio** - Rápido y fácil para ver/editar datos
2. **Script Node.js** - Para verificar datos sin abrir navegador
3. **pgAdmin** - Para tareas avanzadas y backups

---

## 📦 **Insertar Datos de Prueba**

### Crear script de seed:

```bash
cd server
node seed-database.js
```

Este script puede crear:

- ✅ Usuarios de prueba (Admin, Agentes, Clientes)
- ✅ Tickets de ejemplo
- ✅ Mensajes de conversación
- ✅ Artículos de conocimiento

---

## 🔒 **Backup de Base de Datos**

### Hacer backup:

```bash
pg_dump -U postgres -d puntonet_desk > backup_puntonet.sql
```

### Restaurar backup:

```bash
psql -U postgres -d puntonet_desk < backup_puntonet.sql
```

---

## 🚀 **Scripts Disponibles en tu Proyecto**

```bash
# Ver datos en consola
node view-database.js

# Abrir Prisma Studio
npx prisma studio

# Aplicar migraciones
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate

# Resetear base de datos (¡CUIDADO!)
npx prisma migrate reset
```

---

**Última actualización**: 2025-11-30
**Estado actual**: 1 usuario, 0 tickets, base de datos lista para usar
