# 🔐 Configuración de Secretos en GitHub

Para que el CI/CD funcione, necesitas configurar estos secretos en GitHub:

## 📋 Pasos para configurar secretos:

### 1. Ve a tu repositorio en GitHub
- Settings → Secrets and variables → Actions → New repository secret

### 2. Agrega estos secretos:

#### `CLOUDFLARE_API_TOKEN`
```
Valor: [Tu API Token de Cloudflare]
```

#### `CLOUDFLARE_ACCOUNT_ID`
```
Valor: 64ea24182d3ae6981443dab8a4118713
```

## 🛠️ Cómo obtener el API Token:

### Opción A: Usar token existente de wrangler
```bash
# En tu terminal local:
wrangler auth token
```

### Opción B: Crear nuevo token en Cloudflare
1. Ve a: https://dash.cloudflare.com/profile/api-tokens
2. Clic en "Create Token"
3. Usa el template "Edit Cloudflare Workers"
4. Selecciona tu cuenta: JoseMiguel Account
5. Copia el token generado

## 🚀 Una vez configurado:

1. Haz commit y push de los archivos de workflow
2. Cada push a `main` que modifique `apps/worker-api/**` desplegará automáticamente
3. Los PRs también se desplegarán para testing

## 🔍 Verificar que funciona:

1. Haz un pequeño cambio en `apps/worker-api/src/index.ts`
2. Commit y push
3. Ve a Actions tab en GitHub para ver el despliegue
