import { Request, Response } from "express";
import { prisma } from "../index";
import { Priority } from "@prisma/client";

// Fallback static templates if DB is empty
const STATIC_TEMPLATES = [
  {
    id: "template-vpn",
    name: "Solicitud de Acceso VPN",
    subject: "Solicitud de acceso a VPN corporativa",
    description: `Necesito acceso a la VPN para trabajar remotamente.\n\n**Información del usuario:**\n- Nombre completo: \n- Departamento: \n- Dispositivo (Windows/Mac/Linux): \n\n**Justificación:**\n(Explica brevemente por qué necesitas acceso VPN)\n\n**Fecha requerida:**`,
    priority: "MEDIUM" as Priority,
    category: "Acceso y Seguridad",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "template-password",
    name: "Reseteo de Contraseña",
    subject: "Solicitud de reseteo de contraseña",
    description: `Necesito resetear mi contraseña del sistema.\n\n**Sistema afectado:**\n- [ ] Windows/Active Directory\n- [ ] Email corporativo\n- [ ] ERP\n- [ ] Otro: \n\n**Usuario/Email:**\n\n**Razón:**\n- [ ] Olvidé mi contraseña\n- [ ] Cuenta bloqueada\n- [ ] Política de seguridad (cambio periódico)`,
    priority: "HIGH" as Priority,
    category: "Acceso y Seguridad",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "template-software",
    name: "Instalación de Software",
    subject: "Solicitud de instalación de software",
    description: `Requiero la instalación del siguiente software:\n\n**Software solicitado:**\n- Nombre: \n- Versión (si aplica): \n- Licencia requerida: [ ] Sí [ ] No\n\n**Justificación de negocio:**\n\n**Dispositivo:**\n- Hostname/ID: \n- Sistema Operativo: \n\n**Fecha requerida:**`,
    priority: "MEDIUM" as Priority,
    category: "Software y Aplicaciones",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "template-network",
    name: "Problema de Red/Conectividad",
    subject: "Reporte de problema de red",
    description: `Estoy experimentando problemas de conectividad.\n\n**Síntomas:**\n- [ ] No hay conexión a Internet\n- [ ] Conexión lenta/intermitente\n- [ ] No puedo acceder a recursos internos\n- [ ] Otro: \n\n**Ubicación:**\n- Edificio/Piso: \n- Conexión: [ ] Cableada [ ] WiFi\n\n**¿Cuándo comenzó el problema?**\n\n**¿Otros usuarios afectados?**`,
    priority: "HIGH" as Priority,
    category: "Infraestructura",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "template-hardware",
    name: "Solicitud de Hardware",
    subject: "Solicitud de equipo/hardware",
    description: `Necesito el siguiente equipo de cómputo:\n\n**Tipo de equipo:**\n- [ ] Laptop\n- [ ] PC de escritorio\n- [ ] Monitor\n- [ ] Teclado/Mouse\n- [ ] Impresora\n- [ ] Otro: \n\n**Especificaciones requeridas:**\n\n**Justificación:**\n\n**Usuario final:**\n- Nombre: \n- Departamento: \n\n**Presupuesto aprobado:** [ ] Sí [ ] No`,
    priority: "MEDIUM" as Priority,
    category: "Hardware",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "template-bug",
    name: "Reporte de Bug en Sistema",
    subject: "Reporte de error en sistema",
    description: `He encontrado un error en el sistema.\n\n**Sistema/Aplicación:**\n\n**Descripción del error:**\n\n**Pasos para reproducir:**\n1. \n2. \n3. \n\n**Comportamiento esperado:**\n\n**Comportamiento actual:**\n\n**Impacto:**\n- [ ] Crítico - Sistema no utilizable\n- [ ] Alto - Funcionalidad importante afectada\n- [ ] Medio - Inconveniente menor\n- [ ] Bajo - Mejora cosmética\n\n**Screenshots/Logs:** (Adjuntar si es posible)`,
    priority: "MEDIUM" as Priority,
    category: "Soporte Técnico",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "template-general",
    name: "Solicitud General de Soporte",
    subject: "Solicitud de soporte técnico",
    description: `Necesito asistencia técnica con lo siguiente:\n\n**Descripción del problema:**\n\n**Sistema/Aplicación afectada:**\n\n**¿Cuándo ocurrió?**\n\n**¿Es recurrente?** [ ] Sí [ ] No\n\n**¿Algo cambió recientemente?**\n\n**Urgencia:**\n- [ ] Crítico - No puedo trabajar\n- [ ] Alto - Afecta productividad\n- [ ] Normal - Puedo trabajar con limitaciones`,
    priority: "MEDIUM" as Priority,
    category: "Soporte Técnico",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Get all ticket templates (for Service Catalog)
export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await prisma.ticketTemplate.findMany({
      orderBy: {
        category: "asc",
      },
    });

    // If DB is empty, return static fallback templates
    if (templates.length === 0) {
      console.log("⚠️ No templates in DB, using static fallback");
      return res.json(STATIC_TEMPLATES);
    }

    res.json(templates);
  } catch (error) {
    console.error("Error fetching ticket templates:", error);
    // On error, return static templates as fallback
    res.json(STATIC_TEMPLATES);
  }
};

// Get single template
export const getTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const template = await prisma.ticketTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ error: "Failed to fetch template" });
  }
};
