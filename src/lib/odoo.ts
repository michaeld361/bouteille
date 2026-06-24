/* ══════════════════════════════════════════════════════════
   Odoo JSON-RPC Client for Bouteille
   ══════════════════════════════════════════════════════════ */

const ODOO_URL = process.env.ODOO_URL!
const ODOO_DB = process.env.ODOO_DB!
const ODOO_USER = process.env.ODOO_USER!
const ODOO_PASSWORD = process.env.ODOO_PASSWORD!

let cachedUid: number | null = null

/**
 * Low-level JSON-RPC call to Odoo
 */
async function jsonRpc(method: string, params: Record<string, unknown>) {
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'call',
      params,
    }),
  })

  const data = await res.json()
  if (data.error) {
    console.error('[Odoo] RPC Error:', data.error)
    throw new Error(data.error.data?.message || data.error.message || 'Odoo RPC error')
  }
  return data.result
}

/**
 * Authenticate and cache the user ID
 */
async function authenticate(): Promise<number> {
  if (cachedUid) return cachedUid

  const uid = await jsonRpc('call', {
    service: 'common',
    method: 'authenticate',
    args: [ODOO_DB, ODOO_USER, ODOO_PASSWORD, {}],
  })

  if (!uid) throw new Error('Odoo authentication failed')
  cachedUid = uid as number
  return uid as number
}

/**
 * Execute an Odoo model method via JSON-RPC
 */
export async function execute<T = unknown>(
  model: string,
  method: string,
  args: unknown[],
  kwargs?: Record<string, unknown>
): Promise<T> {
  const uid = await authenticate()
  return jsonRpc('call', {
    service: 'object',
    method: 'execute_kw',
    args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs || {}],
  }) as T
}

/**
 * Search and read records from an Odoo model
 */
export async function searchRead<T = Record<string, unknown>>(
  model: string,
  domain: unknown[][],
  fields: string[],
  options?: { limit?: number; offset?: number; order?: string }
): Promise<T[]> {
  return execute<T[]>(model, 'search_read', [domain], {
    fields,
    ...options,
  })
}

/**
 * Read specific records by ID
 */
export async function read<T = Record<string, unknown>>(
  model: string,
  ids: number[],
  fields: string[]
): Promise<T[]> {
  return execute<T[]>(model, 'read', [ids], { fields })
}

/**
 * Create a new record
 */
export async function create(
  model: string,
  values: Record<string, unknown>
): Promise<number> {
  return execute<number>(model, 'create', [values])
}
