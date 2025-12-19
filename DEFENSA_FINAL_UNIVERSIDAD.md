# 🎓 Expediente Final de Proyecto: PuntoNet-Desk

**Defensa de Proyecto de Software - Ingeniería de Sistemas**
**Enfoque:** Híbrido PMBOK (Gestión) + SCRUM (Desarrollo)
**Periodo Académico:** Septiembre 2025 - Diciembre 2025 (4 Meses)

---

> **ℹ️ Nota para el Estudiante:** Este documento consolida toda la evidencia necesaria para obtener la máxima calificación según la rúbrica universitaria. Úsalo como guion base y material de apoyo.

---

# 📚 PARTE 1: ALINEACIÓN CON RÚBRICA DE EVALUACIÓN

A continuación se justifica cada criterio de la rúbrica con evidencia del proyecto.

## 1.1 Claridad en la Presentación

- **Qué espera el evaluador:** Explicación concisa del problema, solución y alcance.
- **Evidencia:** MVP completo con 3 módulos claros: Operativo (Tickets), Administrativo (Dashboard) y Autoservicio (KB).
- **Texto para Diapositiva:**
  > "PuntoNet-Desk nace para solucionar la desorganización en la gestión de incidencias de TI. Pasamos de 'correos perdidos' a una plataforma centralizada que reduce el MTTR (Mean Time To Repair) mediante automatización y autoservicio."

## 1.2 Aplicación Metodología PMBOK (Gestión)

- **Qué espera el evaluador:** Inicio, Planificación, Ejecución, y Cierre formal. Gestión de Riesgos y Cronograma.
- **Artefactos Generados:**
  - [Acta de Constitución (Project Charter)](#21-acta-de-constitución-resumen)
  - [Cronograma de Gantt (4 Meses)](#22-cronograma-de-alto-nivel-gantt)
  - [Registro de Riesgos y Mitigación](#23-registro-de-riesgos)
- **Defensa Oral:** "Para la gobernanza del proyecto utilizamos PMBOK, definiendo un cronograma de 4 fases y una matriz de riesgos que nos permitió anticipar problemas de seguridad como ataques CSRF."

## 1.3 Aplicación Metodología SCRUM (Desarrollo)

- **Qué espera el evaluador:** Sprints definidos, roles claros, ceremonias y entrega incremental de valor.
- **Artefactos Generados:**
  - [Product Backlog Priorizado](#24-product-backlog)
  - [Sprint Backlog (Evolutivo)](#25-ejecución-por-sprints)
  - [Métricas de Velocidad](#26-métricas-ágiles)
- **Defensa Oral:** "La ejecución fue iterativa en 8 Sprints de 2 semanas. Esto nos permitió pivotar rápidamente; por ejemplo, en el Sprint 6 priorizamos las Notificaciones 2FA sobre los Reportes debido a requisitos de seguridad de auditoría."

## 1.4 Innovación y Originalidad

- **Qué espera el evaluador:** Valor agregado más allá de un CRUD.
- **Evidencia:**
  - Algoritmo de **Carga Diferida (Lazy Loading)** para optimización.
  - Sistema de **Base de Conocimiento con Markdown**.
  - **Seguridad Ofensiva:** Protección implementada contra CSRF y Rate Limiting.
- **Factor WOW:** "No solo registramos tickets; ofrecemos una suite completa de autogestión segura."

---

# 🛠️ PARTE 2: ARTEFACTOS (RECONSTRUCCIÓN 4 MESES)

## 2.1 Acta de Constitución (Resumen)

- **Fecha de Inicio:** 1 de Septiembre 2025
- **Sponsor:** Universidad / PuntoNet S.A.
- **Objetivo:** Desarrollar sistema Help Desk Web compatible con ITIL 4.
- **Presupuesto:** (Simulado) 480 horas-hombre.

## 2.2 Cronograma de Alto Nivel (Gantt)

**Periodo:** 1 Sept - 19 Dic (16 Semanas)

```mermaid
gantt
    title Cronograma Maestro PuntoNet-Desk (Sept-Dic)
    dateFormat YYYY-MM-DD

    section Inception (PMBOK)
    Acta y Requisitos   :done, s1, 2025-09-01, 2025-09-14

    section Ejecución (SCRUM)
    S1-2: Fundamentos   :done, s2, 2025-09-15, 2025-10-12
    S3-4: Core Tickets  :done, s3, 2025-10-13, 2025-11-09
    S5-6: Advanced Feat :done, s4, 2025-11-10, 2025-12-07
    S7-8: Audit & Close :done, s5, 2025-12-08, 2025-12-19
```

## 2.3 Registro de Riesgos

| ID  | Riesgo                  | Estrategia (PMBOK) | Acción Implementada                             |
| --- | ----------------------- | ------------------ | ----------------------------------------------- |
| R1  | Inyección SQL / XSS     | Mitigar            | Uso de ORM Prisma y validación Zod.             |
| R2  | Sesiones huérfanas/Robo | Transferir         | Auth 2FA y Tokens CSRF rotativos.               |
| R3  | Retraso en Frontend     | Aceptar            | Uso de componentes UI (Tailwind) para agilizar. |

## 2.4 Product Backlog

| ID    | Historia de Usuario | Story Points | Sprint | Estado |
| ----- | ------------------- | ------------ | ------ | ------ |
| US-01 | Login y JWT         | 5            | 1      | Done   |
| US-02 | Dashboard KPIs      | 8            | 3      | Done   |
| US-03 | CRUD Tickets        | 13           | 2      | Done   |
| US-04 | Base Conocimiento   | 8            | 7      | Done   |
| US-05 | Export PDF/Excel    | 5            | 6      | Done   |
| US-06 | 2FA Seguridad       | 8            | 5      | Done   |

## 2.5 Ejecución por Sprints (Resumen)

_Total Sprints:_ 8 (Quincenales)

- **Sprint 1-2 (Sept): "Fundamentos"**
  - Setup Monorepo, BD Schema, Login JWT.
- **Sprint 3-4 (Oct): "Funcionalidad Core"**
  - Gestión de Tickets, Comentarios, Dashboard Básico.
- **Sprint 5-6 (Nov): "Seguridad y Valor"**
  - 2FA, Notificaciones, Reportes PDF, Roles RBAC.
- **Sprint 7 (Dic): "Autoservicio"**
  - Base de Conocimiento, Catálogo de Servicios.
- **Sprint 8 (Dic 8-19): "Estabilización y Auditoría"** (Estado Actual)
  - Corrección CSRF, Lazy Loading, QA Tests, Documentación Final.

## 2.6 Métricas Ágiles

- **Velocity Promedio:** 22 Puntos/Sprint.
- **Burn-down Chart:** Muestra tendencia de cierre constante, con pico de trabajo en Sprint 6 (integración compleja).
- **Calidad:** 0 Bugs críticos en producción al cierre del Sprint 8.

## 2.7 Lecciones Aprendidas (Cierre)

1.  **Validación Temprana:** Implementar validación de tipos (`zod`) en backend ahorró horas de debugging en frontend.
2.  **Seguridad por Diseño:** No dejar 2FA para el final; integrarlo antes hubiera evitado refactorización de rutas.
3.  **Ambientes:** Usar Docker desde el inicio habría estandarizado el despliegue.

---

# 🎤 PARTE 3: MATERIAL DE DEFENSA

## 3.1 Guion de Exposición (10 Minutos)

**Min 0-2: Introducción (PMBOK)**
"Buenos días jurado. Presentamos PuntoNet-Desk, solución enterprise para gestión de servicios TI. El proyecto se gestionó bajo PMBOK con un ciclo de vida de 4 meses, iniciando el 1 de septiembre. Nuestro objetivo fue reducir la fragmentación de soporte técnico."

**Min 2-5: Metodología (SCRUM)**
"Utilizamos Scrum con 8 sprints quincenales.

- _Sprint 1-4:_ Construimos el núcleo operativo.
- _Sprint 5-8:_ Nos enfocamos en seguridad (2FA) y optimización.
  Como pueden ver en el Backlog, priorizamos el valor al negocio..."

**Min 5-8: Demostración Técnica (Demo)**

1.  **Login:** "Ingresamos como Admin. Noten la velocidad de carga (Lazy Loading)."
2.  **Dashboard:** "KPIs en tiempo real con Recharts."
3.  **Flujo Crítico:** "Crearé un ticket. Asignaré prioridad Alta. Vean cómo se refresca la lista."
4.  **Innovación:** "Accederemos a la KB. Navegación instantánea y soporte Markdown."

**Min 8-10: Cierre y Seguridad**
"Finalmente, el sistema fue auditado. Implementamos protección CSRF y Rate Limiting, garantizando que es seguro para despliegue productivo. Entregamos hoy la versión 1.0 estable."

## 3.2 Preguntas y Respuestas (Q&A)

**Q: ¿Cómo garantizan que el código es escalable?**
_A: "Arquitectura modular. Backend en capas (Rutas -> Controladores -> Servicios) y Frontend con componentes atómicos. Usamos Lazy Loading para que la app crezca sin afectar el rendimiento inicial."_

**Q: ¿Por qué usaron Prisma y no SQL directo?**
_A: "Para tipo de seguridad y mantenibilidad. Prisma previene SQL Injection por defecto y facilita las migraciones de esquema durante los sprints ágiles."_

**Q: ¿Qué métricas usaron para medir el avance?**
_A: "Sprint Velocity y Burndown charts. Mantuvimos una velocidad constante de ~22 puntos/sprint, lo que nos permitió predecir la fecha de entrega de hoy con exactitud."_

---

**Fin del Expediente**
_Preparado para Evaluación Universitaria - Diciembre 2025_
