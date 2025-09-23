import { z } from 'zod'

// Schema para Tenant
export const TenantSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug debe contener solo letras minúsculas, números y guiones'),
  businessName: z.string().min(2, 'Nombre de negocio requerido'),
  plan: z.enum(['esencial', 'pro']),
  status: z.enum(['active', 'inactive', 'suspended']),
  settings: z.object({
    primaryColor: z.string().default('#134572'),
    secondaryColor: z.string().default('#27A3A4'),
    whatsappNumber: z.string().optional(),
    description: z.string().optional(),
    logo: z.string().url().optional(),
    address: z.string().optional()
  }),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Schema para Usuario
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  tenantId: z.string(),
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Schema para Producto
export const ProductSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional(),
  price: z.number().positive('Precio debe ser positivo'),
  originalPrice: z.number().positive().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  stock: z.number().int().min(0, 'Stock no puede ser negativo'),
  images: z.array(z.string().url()).default([]),
  attributes: z.record(z.string()).default({}),
  status: z.enum(['active', 'inactive', 'out_of_stock']).default('active'),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Schema para Orden
export const OrderSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  customerInfo: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email().optional(),
    address: z.string().optional()
  }),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    total: z.number().positive()
  })),
  subtotal: z.number().positive(),
  tax: z.number().min(0).default(0),
  total: z.number().positive(),
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']),
  notes: z.string().optional(),
  whatsappMessageId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Schema para configuración de IA por tenant
export const AIConfigSchema = z.object({
  tenantId: z.string(),
  maxTurnsBeforeHandoff: z.number().int().min(5).max(20).default(10),
  enableVision: z.boolean().default(true),
  enableSTT: z.boolean().default(true),
  customPrompts: z.object({
    welcome: z.string().optional(),
    fallback: z.string().optional(),
    handoff: z.string().optional()
  }).optional(),
  moderationLevel: z.enum(['low', 'medium', 'high']).default('medium')
})

export type Tenant = z.infer<typeof TenantSchema>
export type User = z.infer<typeof UserSchema>  
export type Product = z.infer<typeof ProductSchema>
export type Order = z.infer<typeof OrderSchema>
export type AIConfig = z.infer<typeof AIConfigSchema>
