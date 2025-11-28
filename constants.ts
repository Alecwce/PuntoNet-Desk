import { KPI, Ticket, User } from './types';

export const CURRENT_USER: User = {
  name: "Juan Pérez",
  role: "Técnico N1",
  email: "juan.perez@puntonet.com",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBubLoyIFyJ8j3Ybw6asVG0msIRbMwF054DUlKVQDXpidp-cZqAKY0n5AYlmtMs_p4AoaK4zNR6ovioAwR0Q7u9Pqvsp7kEVtKg-BjCctSOndfgcIECPumB8e4Jq752tOcbOVP7oqDtDGdy2zhM1YwaVoJoQYPUps-5qgH8r2VyTob3lD9LNkcgYrGWPXplHFiXNKyCfgmizr6AsHblKNkkPbFtml83dbOAkeSJyW4Jz982Ty2_rjpdhoiHzRvEq_wXB8bOKP5ThSXZ"
};

export const KPI_DATA: KPI[] = [
  { label: "Tickets Abiertos", value: "125", trend: "5%", trendDirection: "up", trendColor: "green" },
  { label: "Tiempo Resolución Prom.", value: "4h 32m", trend: "2%", trendDirection: "down", trendColor: "red" },
  { label: "Satisfacción (CSAT)", value: "95%", trend: "1%", trendDirection: "up", trendColor: "green" },
  { label: "Tickets Críticos", value: "8", trend: "3%", trendDirection: "up", trendColor: "red" },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "TK-8923",
    subject: "Error al iniciar sesión en el portal",
    client: "Corporativo Alfa",
    priority: "Crítica",
    status: "Abierto",
    assignee: { name: "Lucía Gómez", role: "Técnico", email: "", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPe0Seara2TDnKhlKmzLK8NDghdPSBmBhliQZvZT5GBRd1EPxYGo_CTM9dfz7Mwe5rI9HohXF0F4L9sOKBSpow9B-GSptbfyhLK4YxYGjPQRnaHPIdAyPytEVCMPtSI_Q9zSDS0-FjSg2YdGqS_Hmce_9CsVMKx9XKbwx8sWg5xhYXJPezs3bILvrQS6pOTmuOQ5ZL1g9qRWQcTMz_-o_azVMkxVTdKb8AlqJuR3GQgjfGELfoeAGZ5FBR63y6zAYkwLvI_Ds79okU" },
    lastUpdate: "2024-07-22 09:15",
    messages: []
  },
  {
    id: "TK-12345",
    subject: "No puedo acceder a la VPN",
    client: "Soluciones Globales",
    priority: "Alta",
    status: "En Progreso",
    assignee: CURRENT_USER,
    lastUpdate: "2024-07-22 08:30",
    messages: [
      {
        id: "1",
        text: "Hola, no puedo conectarme a la VPN de la empresa. Me da un error de autenticación.",
        sender: "Ana López (Cliente)",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFh5IycC2c_LQUHFx86xgT3MxhOk03O3pkZvjOxM7KMfnUpywc807OeWDGyqXcwx6g0pS-VtTrD2B-9iMJle8ul9xY-NS4LnOw6-zBt6v6uP9K5vMaySVfRFuVQtllWhjeQzd7z2kNwSQ5G732wuzVs75PmjvKPE_MlAu8SkBwWptOvYrSINY6o2sey0BZMheV7rC36oIiA213CPhEjN2qcK8phitgeJEWY_3g-uAiyEt8D2mjyD1sOG6YHncC3tywQPwZP1OQEWzE",
        timestamp: "10:30 AM",
        isMe: false
      },
      {
        id: "2",
        text: "Hola Ana, buenos días. ¿Podrías confirmar si estás usando las credenciales correctas y si tu token está activo?",
        sender: "Juan Pérez (Tú)",
        avatar: CURRENT_USER.avatar,
        timestamp: "10:32 AM",
        isMe: true
      },
      {
        id: "3",
        text: "Sí, estoy segura de que son las correctas. Dejó de funcionar esta mañana.",
        sender: "Ana López (Cliente)",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr2BGVATSYvX0sHtyhJahoRY_IsstyRCJHqRZkaiRHgjRCFbcsYsbLwwl-kBeVqfo1-7REqN4PBF4og985ErkiKvPxyQIduNzKoM-WIGUgGJiYcN3S-v1CyhHDCIp7EiXCkgTjL7cixkamHJKWHh0W1ZhwqT21Wfg4PxltKrsI5QEWG4lkY4Q_7lrac2-kpCbKAGla_IOsZiExVrSGfAyEjLViqoulJLgrAbLmHtPhbRrlddIUARn9x4xfsKg6APPzxkuRJbmVJCEp",
        timestamp: "10:35 AM",
        isMe: false
      }
    ]
  },
  {
    id: "TK-8921",
    subject: "Impresora no funciona en Contabilidad",
    client: "Innovatech Inc.",
    priority: "Media",
    status: "Abierto",
    assignee: { name: "Ana Jiménez", role: "Técnico", email: "", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-miSlwsHXj3Da3oBaoLD8DbQINVSmX0E9rOhl10-Z5KrmXoJ3TtHxqMfvfsRm9-SoasmHBldH3LKlUhPAg-lYJVlZEf4HJHMO6vIQIpr7uoSFbZtKm2NZo5RL9MpNq4RjCSq1g8WqQalLuDU0qO9QeSkofSwqwDz2-uoXb1YszkbjQcNabFp0ojX4QisST2fYdjc9Ti4WPmhcxd_xRSDg_nvnfm-njjQKTpgUxRGROuJfZc2bl-AESyl-S3IQGbJZqdmAVs_rpGAz" },
    lastUpdate: "2024-07-21 16:45",
    messages: []
  },
  {
    id: "TK-8920",
    subject: "Solicitud de software: Adobe Photoshop",
    client: "Corporativo Alfa",
    priority: "Baja",
    status: "En Progreso",
    assignee: { name: "Carlos Ruiz", role: "Técnico", email: "", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVm3dBdJHMX4sLcYbrNUtk0qUFtcI-YC-BgCAKS9hVZuquhjUkU-8vIjZxXlunTvU8w_omH82kXO5AiomrWS0u4XR86DecJMqt84jsKpoJsmYuq3fAZLLQst_D4h8kn0QQT_B8GAME4q1DcYHorQHpeJ9EImKVn38GFtksuZScRPLrkfc_pGq7ReXzcVmCrOSJZlX6h4JP1iaK_IseZrZ1gHbx-0otReMivvy0KX1hPoulNMkgPcId2l4f9K08BfFjXke99L4AoFP0" },
    lastUpdate: "2024-07-21 11:20",
    messages: []
  },
  {
    id: "TK-8919",
    subject: "Reseteo de contraseña olvidado",
    client: "Soluciones Globales",
    priority: "Baja",
    status: "Resuelto",
    assignee: { name: "Carlos Ruiz", role: "Técnico", email: "", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVm3dBdJHMX4sLcYbrNUtk0qUFtcI-YC-BgCAKS9hVZuquhjUkU-8vIjZxXlunTvU8w_omH82kXO5AiomrWS0u4XR86DecJMqt84jsKpoJsmYuq3fAZLLQst_D4h8kn0QQT_B8GAME4q1DcYHorQHpeJ9EImKVn38GFtksuZScRPLrkfc_pGq7ReXzcVmCrOSJZlX6h4JP1iaK_IseZrZ1gHbx-0otReMivvy0KX1hPoulNMkgPcId2l4f9K08BfFjXke99L4AoFP0" },
    lastUpdate: "2024-07-20 15:00",
    messages: []
  }
];
