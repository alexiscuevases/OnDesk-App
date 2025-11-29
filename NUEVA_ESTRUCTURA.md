# 📊 OnDesk App - Nueva Estructura Modular

## 🎯 Descripción

El proyecto ha sido reestructurado de una arquitectura por tipo de archivo a una arquitectura modular (feature-based). Esto mejora la escalabilidad, mantenibilidad y permite un desarrollo más organizado.

---

## 📁 Estructura de Carpetas

```
src/
├── modules/                    # Módulos de features
│   ├── auth/                  # 🔐 Autenticación & Autorización
│   │   ├── api/               # Endpoints de auth
│   │   ├── components/        # Componentes de auth (formularios, etc)
│   │   ├── hooks/             # use-auth
│   │   ├── services/          # Servicios de negocio
│   │   ├── validations/       # Zod schemas
│   │   ├── constants/         # Constantes del módulo
│   │   ├── types/             # TypeScript types
│   │   └── index.ts           # Exports públicos
│   │
│   ├── dashboard/             # 📊 Dashboard
│   │   ├── components/        # Dashboard UI components
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # Business logic
│   │   └── index.ts
│   │
│   ├── agents/                # 🤖 Agentes de IA
│   ├── conversations/         # 💬 Conversaciones
│   ├── connections/           # 🔗 Conexiones
│   ├── integrations/          # 🔌 Integraciones
│   ├── marketplace/           # 🛒 Marketplace
│   ├── notifications/         # 🔔 Notificaciones
│   ├── team/                  # 👥 Gestión de Equipos
│   ├── widget/                # 🎯 Widget
│   │
│   └── shared/                # ✨ Componentes Compartidos
│       ├── components/
│       │   ├── site-header.tsx
│       │   ├── site-footer.tsx
│       │   ├── language-switcher.tsx
│       │   ├── providers/     # Auth, Query, Theme providers
│       │   ├── landing/       # Componentes de landing
│       │   ├── forms/         # Formularios comunes
│       │   └── pricing/       # Componentes de pricing
│       └── index.ts
│
├── core/                      # 🔧 Infraestructura Compartida
│   ├── hooks/                 # Custom hooks globales
│   │   ├── use-auth.ts
│   │   ├── use-teams.ts
│   │   ├── use-agents.ts
│   │   └── ... (todos los hooks)
│   │
│   ├── services/              # Servicios de negocio
│   │   ├── ai.ts              # Servicios de AI
│   │   ├── endpoints.ts        # Gestión de endpoints
│   │   └── notifications.ts    # Servicio de notificaciones
│   │
│   ├── utils/                 # Utilidades
│   │   ├── utils.ts           # Funciones helper (cn, format, etc)
│   │   ├── stripe.ts          # Configuración de Stripe
│   │   ├── jose.ts            # JWT utilities
│   │   ├── nodemailer.ts       # Email service
│   │   ├── whatsapp.ts         # WhatsApp API
│   │   └── ...
│   │
│   ├── constants/             # Constantes globales
│   │   ├── agent.ts
│   │   ├── connection.ts
│   │   ├── team.ts
│   │   └── ... (todas las constantes)
│   │
│   ├── validations/           # Zod schemas globales
│   │   ├── auth.ts
│   │   ├── agent.ts
│   │   ├── team.ts
│   │   └── ... (todos los schemas)
│   │
│   ├── types/                 # TypeScript types compartidos
│   ├── supabase/              # Configuración de Supabase
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── middleware.ts
│   │   └── admin.ts
│   │
│   └── index.ts               # Exports centrales
│
├── ui/                        # 🎨 Design System (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ... (todos los componentes shadcn/ui)
│
├── app/                       # 📄 Next.js Pages & Routes
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   ├── auth/
│   ├── api/
│   └── ... (rutas de Next.js)
│
├── configs/                   # ⚙️ Configuraciones
│   ├── app.ts
│   └── platform.ts
│
├── i18n/                      # 🌍 Internacionalización
│   └── request.ts
│
└── middleware.ts              # Next.js middleware
```

---

## 🔄 Guía de Imports Actualizados

### ❌ Antes (Antigua Estructura)

```typescript
import { useAuth } from "@/hooks/use-auth";
import { signUpSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site/site-header";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
```

### ✅ Después (Nueva Estructura)

```typescript
import { useAuth } from "@/core/hooks/use-auth";
// O usando el index del módulo:
import { useAuth } from "@/modules/auth";

import { signUpSchema } from "@/core/validations/auth";
import { Button } from "@/ui/button";
import { cn } from "@/core/utils/utils";
import { SiteHeader } from "@/modules/shared/components/site-header";
import { RecentConversations } from "@/modules/dashboard/components/recent-conversations";
```

---

## 📦 Estructura de un Módulo

Cada módulo sigue este patrón estandarizado:

```typescript
// modules/[module-name]/index.ts
// Re-exporta todo lo público del módulo

export { useAuth } from "./hooks/use-auth";
export * from "./validations/auth";
export * from "./components";
```

### Ejemplo: Módulo Auth

```
modules/auth/
├── api/
│   └── route.ts              # Endpoints de autenticación
├── components/
│   ├── sign-in-form.tsx
│   ├── sign-up-form.tsx
│   └── password-recovery.tsx
├── hooks/
│   └── use-auth.ts           # Logic de autenticación
├── services/
│   └── auth.service.ts       # Business logic
├── validations/
│   ├── auth.ts              # Schemas de signin/signup
│   └── profile.ts           # Schemas de perfil
├── constants/
│   └── auth.constants.ts    # Constantes del módulo
├── types/
│   └── auth.types.ts        # Types específicos
└── index.ts                 # Exports públicos
```

---

## 🎯 Ventajas de la Nueva Estructura

✅ **Escalabilidad**: Fácil agregar nuevos módulos sin afectar existentes  
✅ **Mantenibilidad**: Cada módulo es independiente y cohesivo  
✅ **Claridad**: Estructura predictable y fácil de navegar  
✅ **Lazy Loading**: Cargar módulos bajo demanda  
✅ **Testing**: Tests aislados por módulo  
✅ **Colaboración**: Múltiples desarrolladores sin conflictos  
✅ **Reutilización**: Core utilities accesibles globalmente

---

## 📝 Patrones de Desarrollo

### 1. Crear un Nuevo Módulo

```bash
# Crear estructura
mkdir -p src/modules/[new-module]/{api,components,hooks,services,validations,constants,types}

# Crear archivo index.ts
# Exportar lo público del módulo
```

### 2. Importar desde Módulos

```typescript
// ✅ Desde el index del módulo (recomendado)
import { useAuth, signUpSchema } from "@/modules/auth";

// ✅ También es válido:
import { useAuth } from "@/core/hooks/use-auth";
import { signUpSchema } from "@/core/validations/auth";
```

### 3. Importar Componentes UI

```typescript
import { Button, Card, Input } from "@/ui";
// O individual:
import { Button } from "@/ui/button";
```

### 4. Importar Utilidades Centrales

```typescript
import { useAuth, useTeams } from "@/core/hooks";
import { cn, formatDate } from "@/core/utils/utils";
import { stripe } from "@/core/utils/stripe";
```

---

## 🚀 Próximos Pasos

1. ✅ Migración completada
2. ✅ Imports actualizados (173 archivos)
3. ✅ Estructuras de carpetas creadas
4. ⏳ Verificar que todo compila sin errores
5. ⏳ Ejecutar tests
6. ⏳ Actualizar documentación interna

---

## 🔗 Referencias

-   **Arquitectura**: Feature-based modules
-   **UI Components**: shadcn/ui via @/ui
-   **Hooks**: React hooks centralizados en core/
-   **Validaciones**: Zod schemas centralizados en core/validations
-   **Supabase**: Clientes centralizados en core/supabase

---

## ❓ Preguntas Frecuentes

**P: ¿Dónde va un nuevo componente?**  
R: Si es específico de una feature → `modules/[feature]/components/`  
Si es compartido → `modules/shared/components/`  
Si es UI primitivo → `ui/`

**P: ¿Dónde va un nuevo hook?**  
R: Si es específico de una feature → `modules/[feature]/hooks/`  
Si es global → `core/hooks/`

**P: ¿Cómo agrupo validaciones?**  
R: En `core/validations/` pero organizadas por entidad  
Ej: `agent.ts`, `team.ts`, `connection.ts`

**P: ¿Puedo importar entre módulos?**  
R: Sí, pero solo desde sus exports públicos (index.ts)  
Ej: ✅ `from "@/modules/auth"`
❌ `from "@/modules/auth/hooks/use-auth"` (acceso privado)

---

**Última actualización**: Noviembre 28, 2025  
**Versión**: 2.0 (Estructura Modular)
