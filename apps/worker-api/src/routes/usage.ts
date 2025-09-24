import { Hono } from 'hono'
import { Env } from '../index'

type PlanKey = 'esencial' | 'grow' | 'pro'

const usage = new Hono<{ Bindings: Env }>()

function addMonthsClamp(date: Date, months: number): Date {
  const d = new Date(date.getTime())
  const day = d.getDate()
  d.setMonth(d.getMonth() + months)
  // Clamp day to end of target month
  if (d.getDate() < day) {
    d.setDate(0)
  }
  return d
}

function getCurrentCycle(createdAt: string | null): { periodStart: Date; periodEnd: Date } {
  const created = createdAt ? new Date(createdAt) : new Date()
  const now = new Date()

  // Anchor day is the creation day
  const anchorDay = created.getDate()
  const candidate = new Date(now.getFullYear(), now.getMonth(), Math.min(anchorDay, 28))
  let periodStart: Date
  let periodEnd: Date

  if (candidate > now) {
    // Period started last month
    const lastMonth = addMonthsClamp(candidate, -1)
    periodStart = lastMonth
    periodEnd = candidate
  } else {
    // Period started this month
    periodStart = candidate
    periodEnd = addMonthsClamp(candidate, 1)
  }

  return { periodStart, periodEnd }
}

function getPlanLimits(plan: PlanKey) {
  if (plan === 'grow') {
    return { products: 500, iaText: 10000, audioMinutes: 100, users: 1 }
  }
  if (plan === 'pro') {
    return { products: 5000, iaText: 20000, audioMinutes: 300, users: 3 }
  }
  // esencial
  return { products: 50, iaText: 2000, audioMinutes: 20, users: 1 }
}

// GET /usage/tenant/:tenantId - obtener uso actual y límites
usage.get('/tenant/:tenantId', async (c) => {
  try {
    const tenantId = c.req.param('tenantId')
    if (!tenantId) {
      return c.json({ error: 'tenantId requerido' }, 400)
    }

    const supabase = c.get('supabase')

    // Obtener tenant (plan, created_at)
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, plan, created_at')
      .eq('id', tenantId)
      .maybeSingle()

    if (tenantError || !tenant) {
      return c.json({ error: 'Tenant no encontrado' }, 404)
    }

    const plan: PlanKey = (tenant.plan as PlanKey) || 'esencial'
    const limits = getPlanLimits(plan)

    // Calcular ciclo actual basado en fecha de creación
    const { periodStart, periodEnd } = getCurrentCycle(tenant.created_at)
    const periodStartStr = periodStart.toISOString().slice(0, 10)

    // Asegurar registro de uso para el ciclo actual (para contadores mensuales)
    // Nota: Productos y Usuarios se calculan dinámicamente y no se reinician mensualmente.
    const { data: existingUsage, error: usageSelError } = await supabase
      .from('tenant_usage')
      .select('id, ia_text_used, audio_minutes_used, ia_vision_images_used')
      .eq('tenant_id', tenant.id)
      .eq('period_start', periodStartStr)
      .maybeSingle()

    if (usageSelError) {
      console.error('Supabase usage select error:', usageSelError)
    }

    let usageRow = existingUsage
    if (!existingUsage) {
      const { data: inserted, error: insertErr } = await supabase
        .from('tenant_usage')
        .insert({
          tenant_id: tenant.id,
          period_start: periodStartStr,
          period_end: periodEnd.toISOString().slice(0, 10),
          ia_text_used: 0,
          audio_minutes_used: 0,
          ia_vision_images_used: 0
        })
        .select('id, ia_text_used, audio_minutes_used, ia_vision_images_used')
        .single()

      if (insertErr) {
        console.error('Supabase usage insert error:', insertErr)
      } else {
        usageRow = inserted
      }
    }

    // Contar productos activos
    const { count: productsCount } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
      .eq('status', 'active')

    // Contar usuarios activos del tenant
    const { count: usersCount } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
      .eq('status', 'active')

    const items = [
      {
        key: 'products',
        label: 'Productos activos',
        used: productsCount ?? 0,
        limit: limits.products,
        renewableMonthly: false
      },
      {
        key: 'ia_text',
        label: 'Consultas de IA texto',
        used: usageRow?.ia_text_used ?? 0,
        limit: limits.iaText,
        renewableMonthly: true
      },
      {
        key: 'audio_minutes',
        label: 'Audios a texto (minutos)',
        used: usageRow?.audio_minutes_used ?? 0,
        limit: limits.audioMinutes,
        renewableMonthly: true
      },
      {
        key: 'users',
        label: 'Usuarios',
        used: usersCount ?? 0,
        limit: limits.users,
        renewableMonthly: false
      }
    ]

    return c.json({
      plan,
      periodStart: periodStart.toISOString(),
      resetAt: periodEnd.toISOString(),
      items
    })
  } catch (error) {
    console.error('Get usage error:', error)
    return c.json({ error: 'Error obteniendo uso' }, 500)
  }
})

export default usage


