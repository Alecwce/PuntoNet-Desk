# 📘 Guía de Usuario - PuntoNet Desk

¡Bienvenido a **PuntoNet Desk**! 🚀

Esta guía está diseñada para ayudarte a navegar y aprovechar al máximo nuestra plataforma de Mesa de Ayuda. Aquí encontrarás todo lo que necesitas saber para gestionar tus requerimientos de manera eficiente.

---

## 🌟 ¿Qué es PuntoNet Desk?

**PuntoNet Desk** es tu centro de comando para la gestión de servicios y soporte. Imagina un lugar donde todas tus solicitudes, incidencias y consultas se centralizan para ser atendidas con rapidez y transparencia.

Hemos construido este sistema pensando en la **simplicidad y la eficiencia**. No es solo una herramienta para "reportar problemas", es un espacio colaborativo donde Agentes y Clientes trabajan juntos para mantener todo funcionando sin problemas. Con una interfaz moderna e intuitiva, te permite:

- **Crear y dar seguimiento a tickets** en tiempo real.
- **Comunicarte directamente** con el equipo de soporte a través de un chat integrado.
- **Visualizar el estado de tus servicios** mediante gráficos claros y sencillos.
- **Acceder a una base de conocimientos** para resolver dudas frecuentes al instante.

¡Olvídate de los correos perdidos y las llamadas interminables! Con PuntoNet Desk, el control está en tus manos.

---

## 🎫 Entendiendo los Estados del Ticket

Cada ticket en nuestro sistema cuenta una historia, desde que nace como una solicitud hasta que se resuelve satisfactoriamente. Aquí te explicamos qué significa cada capítulo de esa historia:

| Estado          | Icono Sugerido | Significado para el Usuario                                                                                                                                               | ¿Qué debo hacer?                                                                                                                                    |
| :-------------- | :------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Abierto**     |       🟢       | **"Hemos recibido tu solicitud"**. El ticket ha sido creado exitosamente y está en cola de espera para ser asignado a un agente. Aún no se ha comenzado a trabajar en él. | Solo espera un momento. Un agente revisará tu caso pronto.                                                                                          |
| **En Progreso** |       🔵       | **"Estamos trabajando en ello"**. Un agente ya ha tomado tu caso y está activamente buscando una solución o realizando la tarea solicitada.                               | Mantente atento al chat del ticket por si el agente necesita más información de tu parte.                                                           |
| **Resuelto**    |       ✅       | **"¡Listo! Hemos encontrado una solución"**. El agente ha completado el trabajo y cree que tu problema está solucionado.                                                  | Verifica que todo funcione bien. Si estás conforme, no necesitas hacer nada más; el sistema lo cerrará eventualmente o puedes confirmarlo tú mismo. |
| **Cerrado**     |       ⚫       | **"Caso archivado"**. El ciclo de vida de este ticket ha terminado definitivamente. Ya no se pueden realizar más acciones sobre él.                                       | Si el problema persiste o surge uno nuevo, por favor abre un nuevo ticket.                                                                          |

---

## 🚨 Guía de Prioridades: ¿Cuándo usar cuál?

Ayúdanos a ayudarte clasificando correctamente la urgencia de tu problema. Usar la prioridad adecuada asegura que los recursos se destinen primero a quien más lo necesita.

| Prioridad   | Nivel de Urgencia   | ¿Cuándo elegirla?                                                                                                                                                    | Ejemplo                                                                                                                          |
| :---------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **Baja**    | 🐢 **Planificable** | Problemas menores que no interrumpen tu trabajo, consultas generales o sugerencias de mejora. La solución puede esperar unos días sin impacto negativo.              | _"Quisiera solicitar un cambio de color en mi firma de correo"_ o _"¿Cómo puedo exportar este reporte?"_                         |
| **Media**   | 🚶 **Estándar**     | Incidencias que causan inconvenientes o lentitud, pero tienes una forma alternativa de seguir trabajando. Afecta a un solo usuario o función no crítica.             | _"Mi impresora tarda mucho en responder"_ o _"No puedo acceder a una carpeta específica, pero tengo los archivos en mi correo"._ |
| **Alta**    | 🏃 **Urgente**      | Un problema que te impide trabajar completamente o una función importante del sistema está fallando. Necesitas una solución rápida para continuar con tus labores.   | _"El sistema de facturación no me deja guardar recibos"_ o _"Mi computadora no enciende"._                                       |
| **Crítica** | 🔥 **Emergencia**   | **¡Todo detenido!** Un fallo masivo que afecta a toda la empresa, departamentos enteros están parados o hay riesgo de pérdida de datos sensible, seguridad o dinero. | _"Se cayó el servidor principal y nadie tiene internet"_ o _"Se ha detectado una brecha de seguridad"._                          |

---

## 📊 Interpretando el Dashboard (Para Administradores)

Como Administrador, el **Dashboard** es tu torre de control. Usamos gráficos inteligentes (KPIs) para darte una visión instantánea de la salud del soporte. Aquí te enseñamos a "leer" lo que dicen los datos:

### 1. Tarjetas de Resumen (KPIs)

Verás números grandes en la parte superior. Estos son tus signos vitales:

- **Total Tickets**: Volumen histórico. ¿Está creciendo demasiado rápido?
- **Pendientes**: **¡Ojo aquí!** Este es tu "trabajo acumulado". Si este número sube, tu equipo podría estar saturado.
- **En Proceso**: Muestra qué tan activo está tu equipo en este momento.
- **Resueltos**: Muestra tu éxito. ¡Queremos ver este número alto!

### 2. Gráfico de Actividad Semanal (Líneas/Barras)

- **¿Qué muestra?**: La cantidad de tickets nuevos vs. resueltos en los últimos 7 días.
- **¿Cómo leerlo?**:
  - **Línea de "Nuevos" por encima de "Resueltos"**: ⚠️ Alerta. Estás recibiendo más trabajo del que puedes terminar. Se está creando un "cuello de botella".
  - **Líneas paralelas o "Resueltos" por encima**: ✅ Saludable. Tu equipo está al día y manejando bien la carga.
  - **Picos repentinos**: Investiga qué pasó ese día (¿una caída de sistema? ¿una actualización con errores?).

### 3. Distribución por Estado (Gráfico de Dona/Pastel)

- **¿Qué muestra?**: Del 100% de tus tickets activos, qué porcentaje está en cada estado.
- **¿Cómo leerlo?**:
  - Si la porción de **"Abiertos"** es muy grande (más del 30-40%), significa que tardan mucho en _comenzar_ a atender. -> **Solución**: Revisa la asignación de tickets.
  - Si la porción de **"En Progreso"** es enorme, significa que empiezan los tickets pero tardan mucho en _cerrarlos_. -> **Solución**: Capacitación o revisión de procesos complejos.

### 4. Rendimiento de Agentes (Si está disponible)

- Busca a tus "estrellas" (quienes resuelven más) pero también cuida a quienes tienen demasiados tickets abiertos. Un agente sobrecargado es un agente lento (y estresado). Úsalo para redistribuir la carga de trabajo equitativamente.

---

> **Consejo Profesional**: No mires los datos solo por mirar. Hazte preguntas: _"¿Por qué los martes hay más incidencias?"_, _"¿Por qué este tipo de problema siempre es 'Crítico'?"_. El Dashboard tiene las respuestas.

---

_Documentación generada para la versión actual de PuntoNet Desk._
