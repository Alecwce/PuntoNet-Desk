// Script para agregar datos de prueba a la base de datos
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log("🌱 Sembrando datos de prueba en la base de datos...\n");

    // 1. Crear Usuarios
    console.log("👥 Creando usuarios...");

    const admin = await prisma.user.upsert({
      where: { email: "admin@puntonet.com" },
      update: {},
      create: {
        email: "admin@puntonet.com",
        password: "$2a$10$abcdefghijklmnopqrstuvwxyz", // Hash de ejemplo
        name: "Administrador PuntoNet",
        role: "ADMIN",
        avatar:
          "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff",
      },
    });

    const agent1 = await prisma.user.upsert({
      where: { email: "juan.perez@puntonet.com" },
      update: {},
      create: {
        email: "juan.perez@puntonet.com",
        password: "$2a$10$abcdefghijklmnopqrstuvwxyz",
        name: "Juan Pérez",
        role: "AGENT",
        avatar:
          "https://ui-avatars.com/api/?name=Juan+Perez&background=4CAF50&color=fff",
      },
    });

    const agent2 = await prisma.user.upsert({
      where: { email: "lucia.gomez@puntonet.com" },
      update: {},
      create: {
        email: "lucia.gomez@puntonet.com",
        password: "$2a$10$abcdefghijklmnopqrstuvwxyz",
        name: "Lucía Gómez",
        role: "AGENT",
        avatar:
          "https://ui-avatars.com/api/?name=Lucia+Gomez&background=FF9800&color=fff",
      },
    });

    const client1 = await prisma.user.upsert({
      where: { email: "carlos.ruiz@cliente.com" },
      update: {},
      create: {
        email: "carlos.ruiz@cliente.com",
        password: "$2a$10$abcdefghijklmnopqrstuvwxyz",
        name: "Carlos Ruiz",
        role: "CLIENT",
        avatar:
          "https://ui-avatars.com/api/?name=Carlos+Ruiz&background=9C27B0&color=fff",
      },
    });

    const client2 = await prisma.user.upsert({
      where: { email: "ana.lopez@cliente.com" },
      update: {},
      create: {
        email: "ana.lopez@cliente.com",
        password: "$2a$10$abcdefghijklmnopqrstuvwxyz",
        name: "Ana López",
        role: "CLIENT",
        avatar:
          "https://ui-avatars.com/api/?name=Ana+Lopez&background=E91E63&color=fff",
      },
    });

    console.log(`✅ ${await prisma.user.count()} usuarios creados\n`);

    // 2. Crear Tickets
    console.log("🎫 Creando tickets...");

    const ticket1 = await prisma.ticket.create({
      data: {
        subject: "No puedo acceder a la VPN",
        description:
          "Hola, desde esta mañana no puedo conectarme a la VPN de la empresa. Me aparece un error de autenticación.",
        priority: "HIGH",
        status: "IN_PROGRESS",
        creatorId: client1.id,
        assigneeId: agent1.id,
      },
    });

    const ticket2 = await prisma.ticket.create({
      data: {
        subject: "Impresora no funciona en contabilidad",
        description:
          "La impresora del área de contabilidad no está respondiendo. Necesito imprimir documentos urgentes.",
        priority: "MEDIUM",
        status: "OPEN",
        creatorId: client2.id,
        assigneeId: agent2.id,
      },
    });

    const ticket3 = await prisma.ticket.create({
      data: {
        subject: "Solicitud de software: Adobe Photoshop",
        description:
          "Necesito tener instalado Adobe Photoshop para el proyecto de diseño. ¿Pueden gestionar la licencia?",
        priority: "LOW",
        status: "OPEN",
        creatorId: client1.id,
        assigneeId: agent1.id,
      },
    });

    const ticket4 = await prisma.ticket.create({
      data: {
        subject: "Reseteo de contraseña",
        description:
          "Olvidé mi contraseña del sistema. ¿Pueden ayudarme a resetearla?",
        priority: "MEDIUM",
        status: "RESOLVED",
        creatorId: client2.id,
        assigneeId: agent2.id,
      },
    });

    const ticket5 = await prisma.ticket.create({
      data: {
        subject: "Error al iniciar sesión en el portal",
        description:
          "Al intentar acceder al portal corporativo me sale error 500. He probado desde diferentes navegadores.",
        priority: "CRITICAL",
        status: "OPEN",
        creatorId: client1.id,
        assigneeId: agent1.id,
      },
    });

    console.log(`✅ ${await prisma.ticket.count()} tickets creados\n`);

    // 3. Crear Mensajes
    console.log("💬 Creando mensajes...");

    await prisma.message.createMany({
      data: [
        {
          content:
            "Hola, desde esta mañana no puedo conectarme a la VPN. Me da error de autenticación.",
          ticketId: ticket1.id,
          senderId: client1.id,
        },
        {
          content:
            "Hola Carlos, ¿podrías confirmar si estás usando las credenciales correctas y si tu token está activo?",
          ticketId: ticket1.id,
          senderId: agent1.id,
        },
        {
          content:
            "Sí, estoy seguro de que son las correctas. Dejó de funcionar esta mañana.",
          ticketId: ticket1.id,
          senderId: client1.id,
        },
        {
          content:
            "Entendido. Voy a verificar tu cuenta en el servidor. Dame unos minutos.",
          ticketId: ticket1.id,
          senderId: agent1.id,
        },
        {
          content:
            "La impresora del área de contabilidad tiene la luz roja parpadeando.",
          ticketId: ticket2.id,
          senderId: client2.id,
        },
        {
          content:
            "Ana, voy a ir al área para revisarla personalmente. En 10 minutos estaré allí.",
          ticketId: ticket2.id,
          senderId: agent2.id,
        },
      ],
    });

    console.log(`✅ ${await prisma.message.count()} mensajes creados\n`);

    // 4. Crear Knowledge Base
    console.log("📚 Creando artículos de base de conocimientos...");

    await prisma.knowledgeBase.createMany({
      data: [
        {
          title: "Cómo conectarse a la VPN corporativa",
          content:
            "## Pasos para conectarse:\n\n1. Descargar el cliente VPN desde el portal interno\n2. Instalar el certificado de seguridad\n3. Ingresar credenciales corporativas\n4. Conectar",
          tags: ["VPN", "Conexión", "Seguridad", "Red"],
        },
        {
          title: "Resetear contraseña del portal",
          content:
            '## Proceso de reseteo:\n\n1. Ir a la página de login\n2. Clic en "Olvidé mi contraseña"\n3. Ingresar correo corporativo\n4. Revisar email con instrucciones',
          tags: ["Contraseña", "Login", "Seguridad", "Portal"],
        },
        {
          title: "Solución a problemas de impresora",
          content:
            "## Pasos de diagnóstico:\n\n1. Verificar que esté encendida\n2. Revisar conexión de red\n3. Verificar cola de impresión\n4. Reiniciar servicio de impresión",
          tags: ["Impresora", "Hardware", "Problemas Comunes"],
        },
        {
          title: "Solicitar software corporativo",
          content:
            "## Proceso de solicitud:\n\n1. Abrir ticket en Service Desk\n2. Especificar software necesario\n3. Justificación de uso\n4. Esperar aprobación de TI",
          tags: ["Software", "Solicitudes", "Instalación"],
        },
      ],
    });

    console.log(`✅ ${await prisma.knowledgeBase.count()} artículos creados\n`);

    // Resumen Final
    console.log("\n📊 === RESUMEN DE DATOS CREADOS ===");
    const stats = {
      usuarios: await prisma.user.count(),
      tickets: await prisma.ticket.count(),
      mensajes: await prisma.message.count(),
      articulos: await prisma.knowledgeBase.count(),
    };

    console.log(`👥 Usuarios: ${stats.usuarios}`);
    console.log(`🎫 Tickets: ${stats.tickets}`);
    console.log(`💬 Mensajes: ${stats.mensajes}`);
    console.log(`📚 Artículos KB: ${stats.articulos}`);

    console.log("\n✅ ¡Base de datos sembrada correctamente!");
    console.log("\n💡 Ahora puedes:");
    console.log("   1. Abrir Prisma Studio: npx prisma studio");
    console.log("   2. Ver los datos: node view-database.js");
    console.log("   3. Acceder a http://localhost:5173 para probar el login\n");
  } catch (error) {
    console.error("❌ Error al sembrar la base de datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
seedDatabase();
