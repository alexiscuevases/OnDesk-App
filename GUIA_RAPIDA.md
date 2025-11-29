# 📋 Guía Rápida - Nueva Estructura Modular

## 🎯 Resumen

OnDesk-App ha sido completamente reestructurado de una arquitectura tipo (components/, hooks/, lib/) a una **arquitectura modular basada en características**.

## 📁 Estructura Actual

```
src/
├── app/                    # Next.js pages & routes
├── ui/                     # Design system (shadcn/ui)
├── core/                   # Infraestructura compartida
│   ├── actions/           # Server actions (Stripe, etc)
│   ├── configs/           # Configuración centralizada
│   ├── hooks/             # Custom hooks reutilizables
│   ├── services/          # Servicios de negocio
│   ├── utils/             # Utilidades generales
│   ├── constants/         # Constantes compartidas
│   ├── validations/       # Zod schemas
│   └── supabase/          # Cliente de Supabase
│
└── modules/               # Módulos de características
    ├── auth/              # Autenticación
    ├── dashboard/         # Panel de control
    ├── agents/            # Gestión de agentes
    ├── conversations/     # Gestión de conversaciones
    ├── connections/       # Gestión de conexiones
    ├── integrations/      # Integraciones
    ├── marketplace/       # Marketplace
    ├── notifications/     # Sistema de notificaciones
    ├── team/              # Gestión de equipos
    ├── widget/            # Widget embebible
    └── shared/            # Componentes y servicios compartidos
```

## 📌 Convenciones de Imports

### ✅ Correcto

```typescript
// Componentes UI
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";

// Core utilities
import { cn } from "@/core/utils/utils";
import { AppConfigs } from "@/core/configs/app";
import { platformConfigs } from "@/core/configs/platform";
import { useAuth } from "@/core/hooks/use-auth";

// Core actions
import { startCheckoutSession } from "@/core/actions/stripe";

// Core constants
import { SUPPORTED_LANGUAGES } from "@/core/constants/languages";

// Core validations
import { userSchema } from "@/core/validations/auth";

// Módulos
import { AuthProvider } from "@/modules/auth/components/auth-provider";
import { DashboardHeader } from "@/modules/dashboard/components/dashboard-header";
```

### ❌ Evitar

```typescript
// No uses imports del viejo sistema
import { Button } from "@/components/ui/button";  // ❌
import { useAuth } from "@/hooks/use-auth";        // ❌
import { cn } from "@/lib/utils";                  // ❌
import { AppConfigs } from "@/configs/app";        // ❌
import { startCheckoutSession } from "@/actions/stripe";  // ❌
```

## 🏗️ Crear Nuevas Características

### Paso 1: Crear estructura del módulo

```bash
src/modules/mi-feature/
├── components/
│   ├── mi-componente.tsx
│   └── index.ts
├── hooks/
│   └── use-mi-feature.ts
├── services/
│   └── mi-servicio.ts
├── validations/
│   └── schemas.ts
├── constants/
│   └── index.ts
├── types/
│   └── index.ts
└── index.ts
```

### Paso 2: Crear index.ts para exports

```typescript
// src/modules/mi-feature/index.ts
export { MiComponente } from "./components/mi-componente";
export { useMiFeature } from "./hooks/use-mi-feature";
export { miServicio } from "./services/mi-servicio";
export * from "./types";
```

### Paso 3: Usar en la aplicación

```typescript
import { MiComponente, useMiFeature } from "@/modules/mi-feature";
```

## 🔄 Agregar a Core (Compartido)

Si creas algo que múltiples módulos necesitan:

1. **Custom Hook**: `src/core/hooks/use-nombre.ts`
2. **Servicio**: `src/core/services/nombre.ts`
3. **Constante**: `src/core/constants/nombre.ts`
4. **Validación**: `src/core/validations/nombre.ts`
5. **Tipo**: Incluir en `src/core/validations/index.ts`

## 🚀 Server Actions

Todas las server actions están centralizadas en `src/core/actions/`:

```typescript
// src/core/actions/tu-accion.ts
"use server";

export async function miAccion(params: any) {
  // Tu lógica aquí
  return resultado;
}

// src/core/actions/index.ts
export * from "./stripe";
export * from "./tu-accion";
```

## ⚙️ Configuración

```typescript
// Use AppConfigs para configuración de aplicación
import { AppConfigs } from "@/core/configs/app";
const siteUrl = AppConfigs.url;
const stripeKey = AppConfigs.stripe.publishableKey;

// Use platformConfigs para configuración de negocio
import { platformConfigs } from "@/core/configs/platform";
const plans = platformConfigs.plans;
const supportEmail = platformConfigs.mails.support;
```

## 🧪 Testing

Cuando importes desde módulos en tests:

```typescript
// tests/mi-feature.test.ts
import { MiComponente } from "@/modules/mi-feature";
import { cn } from "@/core/utils/utils";
```

## 📊 Estadísticas

- **Módulos**: 11 features modulares
- **Componentes Core**: 20+ UI components
- **Custom Hooks**: 14 hooks reutilizables
- **Validaciones**: 14 Zod schemas
- **Server Actions**: Stripe, auth, etc.

## 🐛 Troubleshooting

### "Module not found"

1. Verifica el path completo (case-sensitive en Linux/Mac)
2. Asegúrate de que el archivo export en `index.ts`
3. Limpia la build: `npm run build`

### Imports circulares

1. Mueve el código compartido a `core/`
2. Usa `index.ts` para exports en lugar de imports directos
3. Refactoriza para separar dependencias

## 📚 Recursos

- [NUEVA_ESTRUCTURA.md](./NUEVA_ESTRUCTURA.md) - Documentación completa
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Guía de migración
- [ARQUITECTURA_FINAL.txt](./ARQUITECTURA_FINAL.txt) - Detalles técnicos

## 👥 Preguntas?

Esta es la estructura final y estable. Todos los imports deben seguir este patrón.

---
**Última actualización:** Migración completa finalizada
**Build Status:** ✅ Pasando (8.9s)
