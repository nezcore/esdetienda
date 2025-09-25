export type PlanKey = 'esencial' | 'grow' | 'pro'

export interface PlanDefinition {
	key: PlanKey
	label: string
	priceDisplay: string
	features: string[]
}

export const PLAN_DEFS: Record<PlanKey, PlanDefinition> = {
	esencial: {
		key: 'esencial',
		label: 'Starter',
		priceDisplay: 'RD$0 / mes',
		features: [
			'Catálogo simple (hasta 50 productos)',
			'Respuestas rápidas básicas',
			'IA texto 2,000 turnos/mes',
			'Audios→texto 20 min/mes',
			'Panel compartido',
			'1 usuario invitado'
		]
	},
	grow: {
		key: 'grow',
		label: 'Grow',
		priceDisplay: 'RD$990 / mes',
		features: [
			'Tienda + catálogo (hasta 500 productos)',
			'Bot de botones + FAQs',
			'IA texto 10,000 turnos/mes',
			'Audios→texto 100 min/mes',
			'Analytics básicos',
			'1 usuario admin'
		]
	},
	pro: {
		key: 'pro',
		label: 'Pro',
		priceDisplay: 'RD$1,990 / mes',
		features: [
			'Todo del Plan Grow +',
			'Búsqueda mejorada (Typesense)',
			'IA texto 20,000 turnos/mes',
			'IA visión 1,000 imágenes/mes',
			'Audios→texto 300 min/mes',
			'3 usuarios admin',
			'Subdominio de marca (opcional)'
		]
	}
}


