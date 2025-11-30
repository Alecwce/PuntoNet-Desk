// Script para ver todos los datos de la base de datos PuntoNet Desk
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function viewAllData() {
  try {
    console.log("\n🔍 === DATOS DE LA BASE DE DATOS PUNTONET DESK ===\n");

    // 1. Ver Usuarios
    console.log("📊 === USUARIOS (User) ===");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            ticketsCreated: true,
            ticketsAssigned: true,
            messages: true,
          },
        },
      },
    });
    console.log(`Total usuarios: ${users.length}`);
    console.table(users);

    // 2. Ver Tickets
    console.log("\n📋 === TICKETS (Ticket) ===");
    const tickets = await prisma.ticket.findMany({
      select: {
        id: true,
        subject: true,
        status: true,
        priority: true,
        createdAt: true,
        creator: {
          select: { name: true },
        },
        assignee: {
          select: { name: true },
        },
        _count: {
          select: { messages: true },
        },
      },
    });
    console.log(`Total tickets: ${tickets.length}`);
    console.table(tickets);

    // 3. Ver Mensajes
    console.log("\n💬 === MENSAJES (Message) ===");
    const messages = await prisma.message.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: { name: true },
        },
        ticket: {
          select: { subject: true },
        },
      },
      take: 10, // Solo los últimos 10
    });
    console.log(`Total mensajes: ${messages.length}`);
    console.table(messages);

    // 4. Ver Knowledge Base
    console.log("\n📚 === BASE DE CONOCIMIENTOS (KnowledgeBase) ===");
    const kb = await prisma.knowledgeBase.findMany({
      select: {
        id: true,
        title: true,
        tags: true,
        createdAt: true,
      },
    });
    console.log(`Total artículos: ${kb.length}`);
    console.table(kb);

    // Resumen
    console.log("\n📈 === RESUMEN ===");
    console.log(`👥 Usuarios: ${users.length}`);
    console.log(`🎫 Tickets: ${tickets.length}`);
    console.log(`💬 Mensajes: ${messages.length}`);
    console.log(`📚 Artículos KB: ${kb.length}`);
  } catch (error) {
    console.error("❌ Error al consultar la base de datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
viewAllData();
