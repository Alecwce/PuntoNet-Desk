# 🎯 Buenas Prácticas - PuntoNet Service Desk

## 📚 Guía de Estándares de Código

### 1. TypeScript - Tipado Fuerte

#### ✅ **USAR**: Tipos Explícitos

```typescript
// ✅ Correcto
const users: User[] = [];
function handleClick(event: React.MouseEvent): void { }
const tickets = tickets.map((ticket: Ticket) => {...});
```

#### ❌ **EVITAR**: Tipo `any`

```typescript
// ❌ Incorrecto
const data: any = response.data;
catch (error: any) { }

// ✅ Correcto
const data: ResponseData = response.data;
catch (error) {
  const typedError = error as AxiosError<ErrorResponse>;
}
```

### 2. Manejo de Errores

#### ✅ **USAR**: Type Guards y Type Assertions

```typescript
// ✅ Correcto
try {
  await api.post("/endpoint", data);
} catch (err) {
  const error = err as AxiosError<{ message?: string }>;
  console.error("Error:", error.response?.data?.message);
}
```

### 3. Constantes y Configuración

#### ✅ **USAR**: Constantes Nombradas

```typescript
// ✅ Correcto
const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  TICKETS: "/tickets",
  USERS: "/users",
} as const;

const AVATAR_URLS = {
  DEFAULT: "https://...",
  ADMIN: "https://...",
} as const;
```

#### ❌ **EVITAR**: Strings Mágicos

```typescript
// ❌ Incorrecto
await api.post("/auth/login", data);
const avatar = "https://very-long-url...";
```

### 4. Props y Interfaces

#### ✅ **USAR**: Interfaces Bien Definidas

```typescript
// ✅ Correcto
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary'
}) => { ... };
```

### 5. Funciones y Handlers

#### ✅ **USAR**: Tipos de Eventos Correctos

```typescript
// ✅ Correcto
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation();
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};
```

### 6. Estado y Hooks

#### ✅ **USAR**: Tipos Explícitos en useState

```typescript
// ✅ Correcto
const [user, setUser] = useState<User | null>(null);
const [tickets, setTickets] = useState<Ticket[]>([]);
const [loading, setLoading] = useState<boolean>(false);

// ✅ También correcto (inferencia clara)
const [count, setCount] = useState(0); // inferido como number
```

### 7. Imports y Exports

#### ✅ **USAR**: Named Exports para Componentes

```typescript
// ✅ Correcto
export const Button: React.FC<ButtonProps> = ({ ... }) => { ... };
export const Modal: React.FC<ModalProps> = ({ ... }) => { ... };
```

#### ✅ **USAR**: Default Export para Páginas/Vistas

```typescript
// ✅ Correcto para App.tsx, main pages
export default App;
```

### 8. Console Logs

#### ⚠️ **LIMITAR**: Console.log solo para desarrollo

```typescript
// ⚠️ Remover en producción
console.log("Debug info", data);

// ✅ Mejor alternativa
if (process.env.NODE_ENV === "development") {
  console.log("Debug info", data);
}

// ✅ Para errores siempre está bien
console.error("Error occurred:", error);
console.warn("Warning:", warning);
```

### 9. Async/Await

#### ✅ **USAR**: Try/Catch con Async/Await

```typescript
// ✅ Correcto
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.get("/endpoint");
    setData(response.data);
  } catch (error) {
    const err = error as AxiosError;
    console.error("Fetch error:", err);
  } finally {
    setLoading(false);
  }
};
```

### 10. Validación de Formularios

#### ✅ **USAR**: Validación Estricta

```typescript
// ✅ Correcto
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validación
  if (!email || !password) {
    setError("Todos los campos son requeridos");
    return;
  }

  if (!email.includes("@")) {
    setError("Email inválido");
    return;
  }

  // Procesar
  await submitForm({ email, password });
};
```

## 🔧 Configuraciones Recomendadas

### ESLint (.eslintrc.json)

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### TSConfig (tsconfig.json)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitAny": true
  }
}
```

## 📋 Checklist de Code Review

Antes de hacer commit, verifica:

- [ ] ✅ No hay uso de `any` en el código
- [ ] ✅ Todos los parámetros tienen tipos explícitos
- [ ] ✅ Interfaces bien definidas para props
- [ ] ✅ Manejo correcto de errores con tipos
- [ ] ✅ Constantes extraídas para valores repetidos
- [ ] ✅ No hay console.log innecesarios
- [ ] ✅ Nombres descriptivos para variables y funciones
- [ ] ✅ Código formateado correctamente
- [ ] ✅ Sin código comentado innecesario
- [ ] ✅ Imports organizados y limpios

## 🎨 Convenciones de Nombres

### Componentes

```typescript
// PascalCase para componentes
export const TicketList: React.FC<Props> = () => { ... };
export const CreateTicketModal: React.FC<Props> = () => { ... };
```

### Funciones y Variables

```typescript
// camelCase para funciones y variables
const handleSubmit = () => { ... };
const userData = { ... };
const isLoading = false;
```

### Constantes

```typescript
// UPPER_SNAKE_CASE para constantes globales
export const API_BASE_URL = 'http://localhost:3001';
export const MAX_RETRY_COUNT = 3;

// PascalCase para objetos constantes
export const AVATAR_URLS = { ... };
export const API_ENDPOINTS = { ... };
```

### Tipos e Interfaces

```typescript
// PascalCase para tipos e interfaces
interface UserProps { ... }
type Status = 'active' | 'inactive';
```

## 🚀 Comandos Útiles

```bash
# Verificar tipos sin compilar
npm run type-check

# Verificar con ESLint
npm run lint

# Auto-fix de ESLint
npm run lint:fix

# Compilar TypeScript
npm run build

# Ejecutar en modo desarrollo
npm run dev
```

## 📖 Recursos Adicionales

- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [ESLint TypeScript](https://typescript-eslint.io/)

---

**Última actualización**: 2025-11-29  
**Mantenedor**: Equipo PuntoNet
