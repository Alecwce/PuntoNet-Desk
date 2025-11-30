# PuntoNet Desk - Backend

Este es el servidor backend para PuntoNet Desk, construido con Node.js, Express, TypeScript y Prisma.

## Requisitos Preios

1.  **PostgreSQL**: Debes tener una instancia de PostgreSQL corriendo.
2.  **Node.js**: Versión 18 o superior.

## Configuración

1.  **Variables de Entorno**:
    El archivo `.env` ya contiene una configuración por defecto. Asegúrate de que la `DATABASE_URL` coincida con tu configuración de PostgreSQL.

    ```env
    DATABASE_URL="postgresql://postgres:password@localhost:5432/puntonet_desk?schema=public"
    ```

2.  **Instalar Dependencias**:

    ```bash
    npm install
    ```

3.  **Configurar Base de Datos**:
    Ejecuta este comando para crear las tablas en tu base de datos:

    ```bash
    npx prisma db push
    ```

4.  **Generar Cliente Prisma**:
    ```bash
    npx prisma generate
    ```

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor iniciará en `http://localhost:3001`.

## Endpoints Disponibles

- **Health Check**: `GET /api/health`
- **Auth**:
  - `POST /api/auth/login`
- **Tickets**:
  - `GET /api/tickets`
  - `POST /api/tickets`
