import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface SupabaseConfig {
  url: string
  anonKey?: string
  serviceKey?: string
}

let cachedAdminClient: SupabaseClient | null = null

export function getSupabaseAdminClient(config: SupabaseConfig) {
  if (!cachedAdminClient) {
    cachedAdminClient = createClient(config.url, config.serviceKey || config.anonKey || '')
  }
  return cachedAdminClient
}

export function getSupabaseClient(config: SupabaseConfig) {
  return createClient(config.url, config.anonKey || '')
}

