import { KPI, Ticket, User } from "./types";

// Avatar constants for better maintainability
const AVATAR_URLS = {
  JUAN_PEREZ:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBubLoyIFyJ8j3Ybw6asVG0msIRbMwF054DUlKVQDXpidp-cZqAKY0n5AYlmtMs_p4AoaK4zNR6ovioAwR0Q7u9Pqvsp7kEVtKg-BjCctSOndfgcIECPumB8e4Jq752tOcbOVP7oqDtDGdy2zhM1YwaVoJoQYPUps-5qgH8r2VyTob3lD9LNkcgYrGWPXplHFiXNKyCfgmizr6AsHblKNkkPbFtml83dbOAkeSJyW4Jz982Ty2_rjpdhoiHzRvEq_wXB8bOKP5ThSXZ",
  LUCIA_GOMEZ:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDPe0Seara2TDnKhlKmzLK8NDghdPSBmBhliQZvZT5GBRd1EPxYGo_CTM9dfz7Mwe5rI9HohXF0F4L9sOKBSpow9B-GSptbfyhLK4YxYGjPQRnaHPIdAyPytEVCMPtSI_Q9zSDS0-FjSg2YdGqS_Hmce_9CsVMKx9XKbwx8sWg5xhYXJPezs3bILvrQS6pOTmuOQ5ZL1g9qRWQcTMz_-o_azVMkxVTdKb8AlqJuR3GQgjfGELfoeAGZ5FBR63y6zAYkwLvI_Ds79okU",
  ANA_LOPEZ:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBFh5IycC2c_LQUHFx86xgT3MxhOk03O3pkZvjOxM7KMfnUpywc807OeWDGyqXcwx6g0pS-VtTrD2B-9iMJle8ul9xY-NS4LnOw6-zBt6v6uP9K5vMaySVfRFuVQtllWhjeQzd7z2kNwSQ5G732wuzVs75PmjvKPE_MlAu8SkBwWptOvYrSINY6o2sey0BZMheV7rC36oIiA213CPhEjN2qcK8phitgeJEWY_3g-uAiyEt8D2mjyD1sOG6YHncC3tywQPwZP1OQEWzE",
  ANA_JIMENEZ:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC-miSlwsHXj3Da3oBaoLD8DbQINVSmX0E9rOhl10-Z5KrmXoJ3TtHxqMfvfsRm9-SoasmHBldH3LKlUhPAg-lYJVlZEf4HJHMO6vIQIpr7uoSFbZtKm2NZo5RL9MpNq4RjCSq1g8WqQalLuDU0qO9QeSkofSwqwDz2-uoXb1YszkbjQcNabFp0ojX4QisST2fYdjc9Ti4WPmhcxd_xRSDg_nvnfm-njjQKTpgUxRGROuJfZc2bl-AESyl-S3IQGbJZqdmAVs_rpGAz",
  CARLOS_RUIZ:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBVm3dBdJHMX4sLcYbrNUtk0qUFtcI-YC-BgCAKS9hVZuquhjUkU-8vIjZxXlunTvU8w_omH82kXO5AiomrWS0u4XR86DecJMqt84jsKpoJsmYuq3fAZLLQst_D4h8kn0QQT_B8GAME4q1DcYHorQHpeJ9EImKVn38GFtksuZScRPLrkfc_pGq7ReXzcVmCrOSJZlX6h4JP1iaK_IseZrZ1gHbx-0otReMivvy0KX1hPoulNMkgPcId2l4f9K08BfFjXke99L4AoFP0",
} as const;

export const CURRENT_USER: User = {
  id: "user-001",
  name: "Juan Pérez",
  role: "ADMIN",
  email: "admin@puntonet.com",
  avatar: AVATAR_URLS.JUAN_PEREZ,
};

export const KPI_DATA: KPI[] = [
  {
    label: "Tickets Abiertos",
    value: "125",
    trend: "5%",
    trendDirection: "up",
    trendColor: "green",
  },
  {
    label: "Tiempo Resolución Prom.",
    value: "4h 32m",
    trend: "2%",
    trendDirection: "down",
    trendColor: "red",
  },
  {
    label: "Satisfacción (CSAT)",
    value: "95%",
    trend: "1%",
    trendDirection: "up",
    trendColor: "green",
  },
  {
    label: "Tickets Críticos",
    value: "8",
    trend: "3%",
    trendDirection: "up",
    trendColor: "red",
  },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "TK-8923",
    subject: "Error al iniciar sesión en el portal",
    description:
      "El usuario reporta problemas al intentar ingresar con sus credenciales.",
    client: "Corporativo Alfa",
    priority: "CRITICAL",
    status: "OPEN",
    assignee: {
      name: "Lucía Gómez",
      role: "Técnico",
      email: "lucia.gomez@puntonet.com",
      avatar: AVATAR_URLS.LUCIA_GOMEZ,
    },
    lastUpdate: "2024-07-22 09:15",
    messages: [],
  },
  {
    id: "TK-12345",
    subject: "No puedo acceder a la VPN",
    description: "Problemas de conexión con el cliente VPN global protect.",
    client: "Soluciones Globales",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assignee: CURRENT_USER,
    lastUpdate: "2024-07-22 08:30",
    messages: [
      {
        id: "1",
        content:
          "Hola, no puedo conectarme a la VPN de la empresa. Me da un error de autenticación.",
        sender: "Ana López (Cliente)",
        avatar: AVATAR_URLS.ANA_LOPEZ,
        timestamp: "10:30 AM",
        isMe: false,
      },
      {
        id: "2",
        content:
          "Hola Ana, buenos días. ¿Podrías confirmar si estás usando las credenciales correctas y si tu token está activo?",
        sender: "Juan Pérez (Tú)",
        avatar: CURRENT_USER.avatar,
        timestamp: "10:32 AM",
        isMe: true,
      },
      {
        id: "3",
        content:
          "Sí, estoy segura de que son las correctas. Dejó de funcionar esta mañana.",
        sender: "Ana López (Cliente)",
        avatar: AVATAR_URLS.ANA_LOPEZ,
        timestamp: "10:35 AM",
        isMe: false,
      },
    ],
  },
  {
    id: "TK-8921",
    subject: "Impresora no funciona en Contabilidad",
    description:
      "La impresora de red no responde a las solicitudes de impresión.",
    client: "Innovatech Inc.",
    priority: "MEDIUM",
    status: "OPEN",
    assignee: {
      name: "Ana Jiménez",
      role: "Técnico",
      email: "ana.jimenez@puntonet.com",
      avatar: AVATAR_URLS.ANA_JIMENEZ,
    },
    lastUpdate: "2024-07-21 16:45",
    messages: [],
  },
  {
    id: "TK-8920",
    subject: "Solicitud de software: Adobe Photoshop",
    description: "El departamento de diseño solicita licencia de Adobe.",
    client: "Corporativo Alfa",
    priority: "LOW",
    status: "IN_PROGRESS",
    assignee: {
      name: "Carlos Ruiz",
      role: "Técnico",
      email: "carlos.ruiz@puntonet.com",
      avatar: AVATAR_URLS.CARLOS_RUIZ,
    },
    lastUpdate: "2024-07-21 11:20",
    messages: [],
  },
  {
    id: "TK-8919",
    subject: "Reseteo de contraseña olvidado",
    description: "Usuario bloqueado por intentos fallidos.",
    client: "Soluciones Globales",
    priority: "LOW",
    status: "RESOLVED",
    assignee: {
      name: "Carlos Ruiz",
      role: "Técnico",
      email: "carlos.ruiz@puntonet.com",
      avatar: AVATAR_URLS.CARLOS_RUIZ,
    },
    lastUpdate: "2024-07-20 15:00",
    messages: [],
  },
];
