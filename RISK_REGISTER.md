# 🛡️ Registro de Riesgos (Risk Register) - PMBOK Compliant

**Proyecto:** PuntoNet Desk  
**Fecha de Actualización:** 19/12/2024  
**Responsable:** Equipo de Desarrollo

Este documento formaliza la identificación, análisis y respuesta a los riesgos del proyecto, alineado con los estándares del PMBOK (Project Management Body of Knowledge).

## 📊 Matriz de Probabilidad e Impacto

| ID       | Riesgo Identificado                   | Prob. | Impacto | Nivel    | Estrategia | Plan de Respuesta (Mitigación)                                                                                                 | Estado        |
| -------- | ------------------------------------- | ----- | ------- | -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| **R-01** | **Bloqueo por CORS en Producción**    | Alta  | Crítico | 🔴 Alto  | Mitigar    | Configuración explicita de orígenes permitidos en `server/index.ts` y exclusión de rutas públicas.                             | ✅ Cerrado    |
| **R-02** | **Saturación de API (Rate Limiting)** | Media | Alto    | 🟡 Medio | Mitigar    | Implementación de `express-rate-limit` global y específico para búsquedas (10 req/min). Aumento de intervalo de polling a 30s. | ✅ Mitigado   |
| **R-03** | **Inyección XSS en Mensajes**         | Media | Alto    | 🟡 Medio | Prevenir   | Sanitización estricta con `DOMPurify` antes de renderizar Markdown. Whitelist de tags HTML.                                    | ✅ Mitigado   |
| **R-04** | **Pérdida de Datos en Formularios**   | Alta  | Medio   | 🟡 Medio | Mitigar    | Implementación de `Auto-save` en localStorage para borradores de tickets.                                                      | ✅ Mitigado   |
| **R-05** | **Migraciones de BD Fallidas**        | Baja  | Crítico | 🔴 Alto  | Evitar     | Protocolo de pruebas de migración en entorno local antes de deploy. Uso de `prisma migrate deploy` en CI/CD.                   | 🔄 En Monitor |
| **R-06** | **Tiempos de Respuesta Lentos**       | Media | Medio   | 🟡 Medio | Aceptar    | Implementación de Skeleton Loaders para mejorar percepción de velocidad. Optimización de queries.                              | ✅ Mitigado   |
| **R-07** | **Acceso No Autorizado a Reportes**   | Baja  | Alto    | 🟡 Medio | Transferir | Implementación de RBAC (Role-Based Access Control) estricto en rutas de backend.                                               | ✅ Mitigado   |

## 📈 Escala de Prioridad

- 🔴 **Alto:** Requiere acción inmediata. Amenaza el éxito del proyecto.
- 🟡 **Medio:** Requiere monitoreo y planes de contingencia.
- 🟢 **Bajo:** Se gestiona con procedimientos rutinarios.

## 📝 Control de Cambios

| Versión | Fecha      | Autor    | Cambios                                      |
| ------- | ---------- | -------- | -------------------------------------------- |
| 1.0     | 19/12/2024 | Dev Team | Creación inicial del registro post-auditoría |
