// Script para agregar datos de prueba a la base de datos
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log("🌱 Sembrando datos de prueba en la base de datos...\n");

    const hashedPassword = await bcrypt.hash("123456", 10);

    // 1. Crear Usuarios
    console.log("👥 Creando usuarios...");

    const admin = await prisma.user.upsert({
      where: { email: "admin@puntonet.com" },
      update: { password: hashedPassword },
      create: {
        email: "admin@puntonet.com",
        password: hashedPassword,
        name: "Administrador PuntoNet",
        role: "ADMIN",
        avatar:
          "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff",
      },
    });

    const agent1 = await prisma.user.upsert({
      where: { email: "juan.perez@puntonet.com" },
      update: { password: hashedPassword },
      create: {
        email: "juan.perez@puntonet.com",
        password: hashedPassword,
        name: "Juan Pérez",
        role: "AGENT",
        avatar:
          "https://ui-avatars.com/api/?name=Juan+Perez&background=4CAF50&color=fff",
      },
    });

    console.log(`✅ ${await prisma.user.count()} usuarios creados\n`);

    // 2. Crear Knowledge Base
    console.log("📚 Creando artículos de base de conocimientos...");

    await prisma.knowledgeBase.createMany({
      data: [
        {
          title: "Cómo conectarse a la VPN corporativa",
          content:
            "## Pasos para conectarse:\n\n1. Descargar el cliente VPN desde el portal interno\n2. Instalar el certificado de seguridad\n3. Ingresar credenciales corporativas\n4. Conectar",
          category: "Redes",
          tags: ["VPN", "Conexión", "Seguridad", "Red"],
          status: "PUBLISHED",
          authorId: admin.id,
        },
        {
          title: "Resetear contraseña del portal",
          content:
            '## Proceso de reseteo:\n\n1. Ir a la página de login\n2. Clic en "Olvidé mi contraseña"\n3. Ingresar correo corporativo\n4. Revisar email con instrucciones',
          category: "Seguridad",
          tags: ["Contraseña", "Login", "Seguridad", "Portal"],
          status: "PUBLISHED",
          authorId: agent1.id,
        },
        {
          title: "Solución a problemas de impresora",
          content:
            "## Pasos de diagnóstico:\n\n1. Verificar que esté encendida\n2. Revisar conexión de red\n3. Verificar cola de impresión\n4. Reiniciar servicio de impresión",
          category: "Hardware",
          tags: ["Impresora", "Hardware", "Problemas"],
          status: "PUBLISHED",
          authorId: agent1.id,
        },
      ],
    });

    console.log(`✅ ${await prisma.knowledgeBase.count()} artículos creados\n`);

    // Resumen Final
    console.log("\n📊 === RESUMEN DE DATOS CREADOS ===");
    const stats = {
      usuarios: await prisma.user.count(),
      articulos: await prisma.knowledgeBase.count(),
    };

    console.log(`👥 Usuarios: ${stats.usuarios}`);
    console.log(`📚 Artículos KB: ${stats.articulos}`);

    console.log("\n✅ ¡Base de datos sembrada correctamente!");
    console.log("\n💡 Credenciales de prueba:");
    console.log("   ADMIN: admin@puntonet.com / 123456");
    console.log("   AGENT: juan.perez@puntonet.com / 123456\n");
  } catch (error) {
    console.error("❌ Error al sembrar la base de datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
seedDatabase();
