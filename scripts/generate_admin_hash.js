// Usage: node scripts/generate_admin_hash.js "YourStrongPassword!"
// Outputs: pbkdf2$<iterations>$<salt_b64>$<hash_b64>

const crypto = require('crypto')

const password = process.argv[2]
if (!password) {
  console.error('ERROR: Provide a password as argument. Example:')
  console.error('  node scripts/generate_admin_hash.js "YourStrongPassword!"')
  process.exit(1)
}

const iterations = 100_000
const salt = crypto.randomBytes(16)
const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256')

const b64 = (b) => Buffer.from(b).toString('base64')
const out = `pbkdf2$${iterations}$${b64(salt)}$${b64(hash)}`
console.log(out)


