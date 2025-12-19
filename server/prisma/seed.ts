import { PrismaClient, Priority } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Service Catalog Templates...");

  // Clear existing templates (optional - comment out in production)
  await prisma.ticketTemplate.deleteMany({});

  const templates = [
    {
      name: "Solicitud de Acceso VPN",
      subject: "Solicitud de acceso a VPN corporativa",
      description: `Necesito acceso a la VPN para trabajar remotamente.

**Información del usuario:**
- Nombre completo: 
- Departamento: 
- Dispositivo (Windows/Mac/Linux): 

**Justificación:**
(Explica brevemente por qué necesitas acceso VPN)

**Fecha requerida:**`,
      priority: "MEDIUM" as Priority,
      category: "Acceso y Seguridad",
    },
    {
      name: "Reseteo de Contraseña",
      subject: "Solicitud de reseteo de contraseña",
      description: `Necesito resetear mi contraseña del sistema.

**Sistema afectado:**
- [ ] Windows/Active Directory
- [ ] Email corporativo
- [ ] ERP
- [ ] Otro: 

**Usuario/Email:**

**Razón:**
- [ ] Olvidé mi contraseña
- [ ] Cuenta bloqueada
- [ ] Política de seguridad (cambio periódico)`,
      priority: "HIGH" as Priority,
      category: "Acceso y Seguridad",
    },
    {
      name: "Instalación de Software",
      subject: "Solicitud de instalación de software",
      description: `Requiero la instalación del siguiente software:

**Software solicitado:**
- Nombre: 
- Versión (si aplica): 
- Licencia requerida: [ ] Sí [ ] No

**Justificación de negocio:**

**Dispositivo:**
- Hostname/ID: 
- Sistema Operativo: 

**Fecha requerida:**`,
      priority: "MEDIUM" as Priority,
      category: "Software y Aplicaciones",
    },
    {
      name: "Problema de Red/Conectividad",
      subject: "Reporte de problema de red",
      description: `Estoy experimentando problemas de conectividad.

**Síntomas:**
- [ ] No hay conexión a Internet
- [ ] Conexión lenta/intermitente
- [ ] No puedo acceder a recursos internos
- [ ] Otro: 

**Ubicación:**
- Edificio/Piso: 
- Conexión: [ ] Cableada [ ] WiFi

**¿Cuándo comenzó el problema?**

**¿Otros usuarios afectados?**`,
      priority: "HIGH" as Priority,
      category: "Infraestructura",
    },
    {
      name: "Solicitud de Hardware",
      subject: "Solicitud de equipo/hardware",
      description: `Necesito el siguiente equipo de cómputo:

**Tipo de equipo:**
- [ ] Laptop
- [ ] PC de escritorio
- [ ] Monitor
- [ ] Teclado/Mouse
- [ ] Impresora
- [ ] Otro: 

**Especificaciones requeridas:**

**Justificación:**

**Usuario final:**
- Nombre: 
- Departamento: 

**Presupuesto aprobado:** [ ] Sí [ ] No`,
      priority: "MEDIUM" as Priority,
      category: "Hardware",
    },
    {
      name: "Reporte de Bug en Sistema",
      subject: "Reporte de error en sistema",
      description: `He encontrado un error en el sistema.

**Sistema/Aplicación:**

**Descripción del error:**

**Pasos para reproducir:**
1. 
2. 
3. 

**Comportamiento esperado:**

**Comportamiento actual:**

**Impacto:**
- [ ] Crítico - Sistema no utilizable
- [ ] Alto - Funcionalidad importante afectada
- [ ] Medio - Inconveniente menor
- [ ] Bajo - Mejora cosmética

**Screenshots/Logs:** (Adjuntar si es posible)`,
      priority: "MEDIUM" as Priority,
      category: "Soporte Técnico",
    },
    {
      name: "Solicitud General de Soporte",
      subject: "Solicitud de soporte técnico",
      description: `Necesito asistencia técnica con lo siguiente:

**Descripción del problema:**

**Sistema/Aplicación afectada:**

**¿Cuándo ocurrió?**

**¿Es recurrente?** [ ] Sí [ ] No

**¿Algo cambió recientemente?**

**Urgencia:**
- [ ] Crítico - No puedo trabajar
- [ ] Alto - Afecta productividad
- [ ] Normal - Puedo trabajar con limitaciones`,
      priority: "MEDIUM" as Priority,
      category: "Soporte Técnico",
    },
  ];

  for (const template of templates) {
    await prisma.ticketTemplate.create({
      data: template,
    });
    console.log(`✅ Created template: ${template.name}`);
  }

  console.log(
    `\n🎉 Successfully seeded ${templates.length} service templates!`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
