# Expediente de Proyecto – PuntoNet-Desk

## 2. Roadmap del Proyecto

El desarrollo del proyecto PuntoNet-Desk se planificó en un horizonte de 4 meses, alineado con el semestre académico (Septiembre - Diciembre 2025). Se estructuró en cuatro fases principales que combinan la gestión del ciclo de vida predictivo (PMBOK) con la ejecución adaptativa (SCRUM).

| Fase                          | Mes                            | Hitos Principales                                                           | Entregables Clave                                                                                  |
| ----------------------------- | ------------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **I. Inicio y Planificación** | Septiembre (Sem 1-2)           | Definición de alcance, selección de arquitectura y diseño de base de datos. | Project Charter, Diagrama ER, Mockups UI, Backlog Inicial.                                         |
| **II. Desarrollo Núcleo**     | Septiembre (Sem 3-4) - Octubre | Desarrollo de módulos funcionales críticos (Tickets y Autenticación).       | MVP Funcional (v0.5), Autenticación JWT, CRUD Tickets.                                             |
| **III. Valor Agregado**       | Noviembre                      | Implementación de características avanzadas y seguridad.                    | Autenticación 2FA, Dashboard KPI, Reportes PDF.                                                    |
| **IV. Cierre y Validación**   | Diciembre                      | Pruebas inregrales, correcciones de auditoría y despliegue final.           | Base de Conocimiento, Catálogo de Servicios, Despliegue en Producción (v1.0), Documentación Final. |

---

## 4. Product Backlog

El Product Backlog agrupa los requisitos funcionales en Historias de Usuario (HU), priorizadas según el valor de negocio.

| ID    | Épica              | Historia de Usuario                                                                                       | Prioridad | Estimación (Sp) |
| ----- | ------------------ | --------------------------------------------------------------------------------------------------------- | --------- | --------------- |
| HU-01 | Seguridad          | Como administrador, quiero autenticarme en el sistema para acceder a las funciones protegidas.            | Alta      | 5               |
| HU-02 | Gestión de Tickets | Como usuario cliente, quiero registrar un incidente adjuntando evidencia para solicitar soporte.          | Crítica   | 8               |
| HU-03 | Gestión de Tickets | Como agente de soporte, quiero visualizar y filtrar mis tickets asignados para priorizar mi atención.     | Crítica   | 5               |
| HU-04 | Gestión de Tickets | Como agente, quiero actualizar el estado y agregar comentarios a un ticket para trazar su resolución.     | Alta      | 5               |
| HU-05 | Dashboard          | Como gerente TI, quiero ver un panel con métricas de rendimiento para la toma de decisiones.              | Media     | 8               |
| HU-06 | Seguridad          | Como usuario, quiero configurar autenticación de dos factores (2FA) para proteger mi cuenta.              | Alta      | 8               |
| HU-07 | Autoservicio       | Como cliente, quiero consultar una Base de Conocimiento para resolver dudas frecuentes sin abrir tickets. | Media     | 5               |
| HU-08 | Autoservicio       | Como cliente, quiero acceder a un Catálogo de Servicios para tipificar correctamente mis solicitudes.     | Media     | 3               |
| HU-09 | Auditoría          | Como auditor, quiero que el sistema valide CSRF y límites de peticiones para prevenir ataques.            | Alta      | 5               |

---

## 5. Sprint Backlog

A continuación, se detalla el **Sprint 8 (Sprint de Cierre y Estabilización)**, ejecutado en la primera quincena de diciembre.

**Objetivo del Sprint:** Finalizar módulos de autoservicio y asegurar la calidad técnica del producto para el paso a producción.

| ID Tarea | Descripción de la Tarea                                          | Responsable     | Estado     | Horas Est. |
| -------- | ---------------------------------------------------------------- | --------------- | ---------- | ---------- |
| T-801    | Implementación del módulo frontend de Base de Conocimiento (KB). | Desarrollador A | Completado | 6          |
| T-802    | Desarrollo de API y rutas para búsqueda de artículos KB.         | Desarrollador B | Completado | 4          |
| T-803    | Implementación de protección CSRF en todas las peticiones API.   | Desarrollador B | Completado | 3          |
| T-804    | Optimización de carga mediante Lazy Loading en React Router.     | Desarrollador A | Completado | 3          |
| T-805    | Corrección de error de compilación en endpoint de tokens.        | DevOps          | Completado | 2          |
| T-806    | Ejecución de pruebas unitarias para utilidades de fechas.        | QA              | Completado | 4          |
| T-807    | Despliegue final en plataforma Railway.                          | DevOps          | Completado | 2          |

---

## 6. Incrementos del Producto

Cada Sprint culminó con un incremento funcional, desplegado en un entorno de pruebas (Staging) o Producción.

| Sprint   | Periodo              | Versión | Funcionalidades Entregadas (Incremento)                                                          |
| -------- | -------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| Sprint 1 | Septiembre (Sem 3-4) | v0.1.0  | Arquitectura base, configuración de base de datos y registro de usuarios.                        |
| Sprint 2 | Octubre (Sem 1-2)    | v0.2.0  | Login funcional, creación básica de tickets y listado general.                                   |
| Sprint 3 | Octubre (Sem 3-4)    | v0.4.0  | Flujos de atención (cambio de estados), comentarios y roles de usuario.                          |
| Sprint 4 | Noviembre (Sem 1-2)  | v0.5.0  | Dashboard administrativo con gráficas y métricas básicas.                                        |
| Sprint 5 | Noviembre (Sem 3-4)  | v0.7.0  | Módulo de reportes y exportación a PDF/Excel.                                                    |
| Sprint 6 | Noviembre (Sem 3-4)  | v0.8.0  | Implementación de doble factor de autenticación (2FA).                                           |
| Sprint 7 | Diciembre (Sem 1-2)  | v0.9.0  | Catálogo de Servicios y estructura de Base de Conocimiento.                                      |
| Sprint 8 | Diciembre (Sem 3)    | v1.0.0  | Versión Final Producción: Seguridad reforzada, optimización de rendimiento y corrección de bugs. |

---

## 7. Actas de Reuniones Scrum

**Reunión: Sprint Review (Sprint 8)**
**Fecha:** 19 de Diciembre de 2025
**Asistentes:** Product Owner, Scrum Master, Equipo de Desarrollo.

**Agenda y Resultados:**

1.  **Demostración:** El equipo presentó el funcionamiento del buscador en la Base de Conocimiento y la navegación fluida gracias al Lazy Loading.
2.  **Validación:** El Product Owner aprobó el incremento v1.0.0, confirmando que cumple con los criterios de aceptación de auditoría técnica.
3.  **Feedback:** Se destacó la velocidad de respuesta del sistema, aunque se recomendó mejorar la interfaz móvil en futuras versiones.

**Reunión: Sprint Retrospective (Sprint 8)**
**Fecha:** 19 de Diciembre de 2025

**Análisis del Equipo:**

- **¿Qué funcionó bien?** La automatización del despliegue en Railway permitió detectar errores de integración rápidamente. La comunicación fluida para resolver el error crítico de CSRF.
- **¿Qué se puede mejorar?** La deuda técnica relacionada con los tipos en TypeScript se acumuló hasta el final, obligando a un esfuerzo extra de refactorización.
- **Plan de Acción:** Para futuros mantemientos, establecer reglas de linter más estrictas desde el día uno.

---

## 8. Registro de Riesgos

La gestión de riesgos siguió el enfoque PMBOK, identificando, analizando y planificando respuestas.

| ID   | Descripción del Riesgo                                                          | Probabilidad | Impacto | Estrategia de Respuesta                                                                                       | Estado Actual       |
| ---- | ------------------------------------------------------------------------------- | ------------ | ------- | ------------------------------------------------------------------------------------------------------------- | ------------------- |
| R-01 | Vulnerabilidades de seguridad web (XSS, CSRF) en formularios públicos.          | Media        | Alto    | **Mitigar:** Implementación de tokens CSRF y cabeceras de seguridad Helmet en el backend.                     | Cerrado             |
| R-02 | Pérdida de integridad referencial en la base de datos por borrados manuales.    | Baja         | Alto    | **Evitar:** Uso de claves foráneas estrictas y borrado lógico (soft delete) en Prisma.                        | Activo (Controlado) |
| R-03 | Tiempos de carga excedidos en conexiones lentas por tamaño del bundle frontend. | Alta         | Medio   | **Mitigar:** Implementación de Code Splitting y Lazy Loading en rutas principales.                            | Cerrado             |
| R-04 | Fallo en el servicio de almacenamiento de archivos adjuntos.                    | Baja         | Medio   | **Transferir:** Uso de sistema de archivos local con validación estricta de tipos y tamaños o servicio Cloud. | Activo              |
| R-05 | Indisponibilidad de la plataforma en horario de evaluación final.               | Media        | Crítico | **Aceptar:** Configuración de reinicio automático y monitoreo básico en servidor de producción.               | Activo              |

---

## 9. Métricas Ágiles

Se utilizaron métricas para monitorear la productividad del equipo y la calidad del entregable.

**1. Velocidad del Equipo (Velocity):**

- Promedio: 22 Puntos de Historia por Sprint.
- Tendencia: Creciente en los primeros sprints, estable en la etapa media, con una ligera caída en el Sprint 6 por complejidad técnica (2FA).

**2. Gráfico de Quemado (Burndown Chart):**

- El Sprint 8 finalizó con 0 puntos pendientes, demostrando un cumplimiento del 100% del compromiso de cierre.

**3. Densidad de Defectos:**

- Se detectaron 0 errores críticos en el entorno de producción v1.0.0 tras la fase de estabilización.

---

## 10. Informe Final del Proyecto

**Resumen Ejecutivo**
El proyecto PuntoNet-Desk ha concluido exitosamente su ciclo de vida de desarrollo de 4 meses. Se entrega una plataforma Web de Mesa de Ayuda operativa, desplegada en infraestructura Cloud (Railway/Vercel) y alineada a las mejores prácticas de gestión de servicios TI (ITIL 4).

**Cumplimiento de Objetivos**

- **Alcance:** Se implementaron el 100% de los requerimientos funcionales documentados en el Product Backlog.
- **Tiempo:** El proyecto se completó dentro del cronograma académico establecido (19 de diciembre).
- **Calidad:** El sistema pasó satisfactoriamente las pruebas de seguridad y rendimiento, cumpliendo los estándares de la rúbrica de evaluación.

**Conclusiones**
PuntoNet-Desk representa una solución robusta y escalable que moderniza la gestión de incidencias, ofreciendo una experiencia de usuario segura y eficiente. El equipo demostró capacidad para conjugar la disciplina de la gestión de proyectos (PMBOK) con la agilidad técnica (SCRUM).

---

## 11. Lecciones Aprendidas

Como cierre del proyecto, se documentan las principales enseñanzas para futuros desarrollos:

1.  **Importancia del Tipado Estático:** El uso estricto de TypeScript desde el inicio es crucial. Permitir tipos flexibles (`any`) aceleró el inicio pero generó deuda técnica costosa de corregir en la fase final.
2.  **Seguridad por Diseño:** La implementación tardía de mecanismos como 2FA y CSRF implicó refactorizaciones complejas. La seguridad debe ser una prioridad desde el Sprint 0.
3.  **Automatización de Despliegues:** Contar con un pipeline de CI/CD (Integración y Despliegue Continuo) fue fundamental para asegurar que el código en el repositorio siempre fuera funcional en producción, actuando como un primer filtro de calidad.
4.  **Gestión de Dependencias:** Mantener las librerías actualizadas y verificar la compatibilidad entre Frontend y Backend evitó conflictos de versiones durante el ensamblaje final.
