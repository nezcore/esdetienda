// Utilidades de hashing/verificación de contraseñas usando Web Crypto (PBKDF2)

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  // @ts-ignore
  return btoa(binary)
}

function fromBase64(b64: string): ArrayBuffer {
  // @ts-ignore
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

export async function hashPasswordPBKDF2(password: string, iterations = 100_000): Promise<string> {
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits'])
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, keyMaterial, 256)
  const saltB64 = toBase64(salt.buffer)
  const hashB64 = toBase64(derived)
  return `pbkdf2$${iterations}$${saltB64}$${hashB64}`
}

export async function verifyPasswordPBKDF2(password: string, stored: string): Promise<boolean> {
  try {
    if (!stored.startsWith('pbkdf2$')) return false
    const parts = stored.split('$')
    const iterations = parseInt(parts[1], 10)
    const salt = fromBase64(parts[2])
    const expected = parts[3]
    const enc = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits'])
    const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new Uint8Array(salt), iterations, hash: 'SHA-256' }, keyMaterial, 256)
    const hashB64 = toBase64(derived)
    return hashB64 === expected
  } catch {
    return false
  }
}


