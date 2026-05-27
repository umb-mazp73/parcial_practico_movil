# CLAUDE.md

# Sistema de Gestión de Facturas Maestro-Detalle
Aplicación móvil profesional desarrollada con React Native + Expo + Supabase.

---

# OBJETIVO DEL PROYECTO

Desarrollar una aplicación móvil moderna, escalable y profesional para la gestión de:

- Clientes
- Artículos
- Facturas
- Detalle de facturas

Usando:

- React Native
- Expo
- TypeScript
- Supabase
- PostgreSQL
- Expo Router
- NativeWind
- React Query
- Zustand
- React Hook Form
- Zod

La aplicación debe incluir:
- CRUD completo
- Diseño moderno
- Arquitectura limpia
- Estado global
- Validaciones
- Manejo de errores
- Dashboard
- Cálculos automáticos
- Navegación profesional

---

# STACK TECNOLÓGICO

## Frontend

- React Native
- Expo
- TypeScript
- Expo Router
- NativeWind
- React Native Paper
- React Query
- Zustand
- React Hook Form
- Zod
- React Native Reanimated
- Gesture Handler

## Backend

- Supabase
- PostgreSQL

---

# VARIABLES DE ENTORNO

## .env

```env
VITE_SUPABASE_URL=https://spnocjqiknemiausxgtv.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Pfb9S8ZC30nE6_RKqJEFUw_xCNemP4V
```

---

# INSTALACIÓN

```bash
npm install @supabase/supabase-js
npm install expo-router
npm install react-native-safe-area-context
npm install react-native-screens
npm install react-native-reanimated
npm install react-native-gesture-handler
npm install react-native-paper
npm install nativewind
npm install tailwindcss
npm install react-hook-form
npm install zod
npm install @hookform/resolvers
npm install @tanstack/react-query
npm install zustand
npm install react-native-toast-message
npm install react-native-vector-icons
```

---

# ESTRUCTURA DEL PROYECTO

```txt
app/
components/
screens/
services/
hooks/
utils/
store/
types/
constants/
theme/
assets/
forms/
layouts/
```

---

# CONFIGURACIÓN SUPABASE

## utils/supabase.ts

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
```

---

# ESQUEMA COMPLETO DE BASE DE DATOS

## SQL SUPABASE

```sql
-- =========================================================
-- EXTENSIONES NECESARIAS PARA SUPABASE
-- =========================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- TABLA: clientes
-- =========================================================
CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,

    correo VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),

    direccion TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =========================================================
-- TABLA: articulos
-- =========================================================
CREATE TABLE public.articulos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre VARCHAR(150) NOT NULL,

    descripcion TEXT,

    precio NUMERIC(10,2) NOT NULL
    CHECK (precio >= 0),

    stock INTEGER NOT NULL DEFAULT 0
    CHECK (stock >= 0),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =========================================================
-- TABLA: facturas
-- =========================================================
CREATE TABLE public.facturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    cliente_id UUID NOT NULL,

    fecha TIMESTAMP WITH TIME ZONE DEFAULT now(),

    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,

    impuesto NUMERIC(10,2) NOT NULL DEFAULT 0,

    total NUMERIC(10,2) NOT NULL DEFAULT 0,

    estado VARCHAR(20) DEFAULT 'PENDIENTE'
    CHECK (estado IN ('PENDIENTE', 'PAGADA', 'CANCELADA')),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT fk_factura_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES public.clientes(id)
        ON DELETE CASCADE
);

-- =========================================================
-- TABLA: detalle_factura
-- =========================================================
CREATE TABLE public.detalle_factura (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    factura_id UUID NOT NULL,

    articulo_id UUID NOT NULL,

    cantidad INTEGER NOT NULL
    CHECK (cantidad > 0),

    precio_unitario NUMERIC(10,2) NOT NULL
    CHECK (precio_unitario >= 0),

    subtotal NUMERIC(10,2) NOT NULL,

    impuesto NUMERIC(10,2) NOT NULL DEFAULT 0,

    total NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT fk_detalle_factura
        FOREIGN KEY (factura_id)
        REFERENCES public.facturas(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_articulo
        FOREIGN KEY (articulo_id)
        REFERENCES public.articulos(id)
        ON DELETE RESTRICT
);

-- =========================================================
-- ÍNDICES
-- =========================================================
CREATE INDEX idx_facturas_cliente
ON public.facturas(cliente_id);

CREATE INDEX idx_detalle_factura
ON public.detalle_factura(factura_id);

CREATE INDEX idx_detalle_articulo
ON public.detalle_factura(articulo_id);
```

---

# FUNCIONALIDADES OBLIGATORIAS

## CLIENTES

- Listar clientes
- Crear cliente
- Editar cliente
- Eliminar cliente
- Buscar clientes
- Validaciones Zod

Campos:
- nombre
- apellido
- correo
- telefono
- direccion

---

## ARTÍCULOS

- Listar artículos
- Crear artículo
- Editar artículo
- Eliminar artículo
- Buscar artículos

Campos:
- nombre
- descripcion
- precio
- stock

---

## FACTURAS

- Crear factura
- Seleccionar cliente
- Agregar múltiples productos
- Calcular subtotal
- Calcular impuestos
- Calcular total
- Ver detalle factura
- Listar facturas
- Eliminar factura

---

## DETALLE FACTURA

Campos:
- articulo
- cantidad
- precio_unitario
- subtotal
- impuesto
- total

---

# PANTALLAS

La aplicación debe incluir:

- Splash Screen
- Home Dashboard
- Clientes Screen
- Crear Cliente
- Editar Cliente
- Artículos Screen
- Crear Artículo
- Editar Artículo
- Facturas Screen
- Crear Factura
- Detalle Factura
- Configuración

---

# DASHBOARD

Debe mostrar:

- Total clientes
- Total artículos
- Total facturas
- Ingresos totales
- Últimas facturas

Con:
- cards modernas
- gráficos simples
- animaciones
- skeleton loading

---

# UI/UX

Diseño moderno tipo SaaS premium.

Debe incluir:

- Cards elegantes
- Sombras suaves
- Bordes redondeados
- FAB buttons
- Toast notifications
- Empty states
- Skeleton loaders
- Pull to refresh
- Dark mode
- Iconos modernos
- Animaciones fluidas

---

# VALIDACIONES

Usar:
- React Hook Form
- Zod

Validar:
- correos
- números
- campos requeridos
- precios positivos
- stock válido

---

# ESTADO GLOBAL

Usar Zustand para:
- tema
- usuario
- carrito temporal factura
- filtros
- configuraciones

---

# REACT QUERY

Usar React Query para:
- cache
- sincronización
- invalidación
- loading states
- refetch automático

---

# CRUD COMPLETO

Todos los módulos deben incluir:

- create
- read
- update
- delete

Con:
- loading
- manejo de errores
- confirmaciones
- feedback visual

---

# CALCULADORA FACTURAS

Cada factura debe calcular automáticamente:

```txt
subtotal = cantidad * precio_unitario

impuesto = subtotal * 0.19

total = subtotal + impuesto
```

Y calcular:
- subtotal general
- impuestos generales
- total general

---

# TIPADO TYPESCRIPT

Crear interfaces completas para:

- Cliente
- Articulo
- Factura
- DetalleFactura

---

# NAVEGACIÓN

Usar Expo Router.

Debe tener:
- Tabs
- Stack navigation
- rutas protegidas
- layouts organizados

---

# ARQUITECTURA

Usar arquitectura limpia:

- components
- services
- hooks
- store
- screens
- utils

Separación clara de responsabilidades.

---

# SERVICIOS

Crear servicios separados:

- cliente.service.ts
- articulo.service.ts
- factura.service.ts

Con funciones:
- getAll
- getById
- create
- update
- remove

---

# REQUISITOS IMPORTANTES

- Código limpio
- Buenas prácticas
- Escalable
- Modular
- Reutilizable
- Responsive
- Profesional
- Producción real

---

# RESULTADO FINAL

Generar:

- Todo el proyecto
- Todos los archivos
- Toda la configuración
- Todo el código
- Todas las pantallas
- Todos los componentes
- Todos los hooks
- Todos los servicios
- Toda la navegación
- Todo el CRUD funcional

Proyecto listo para ejecutar con:

```bash
npm install
npx expo start
```

NO OMITIR NADA.