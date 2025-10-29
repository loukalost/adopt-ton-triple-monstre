# Configuration Documentation Docusaurus - Fix Route /documentation

**Date**: 29 octobre 2025  
**Problème**: La route `/documentation` ne fonctionnait pas  
**Solution**: Configuration Next.js + script de copie automatique

---

## ✅ Problème Résolu

La route `/documentation` ne fonctionnait pas car Next.js n'était pas configuré pour servir les fichiers statiques Docusaurus.

---

## 🔧 Modifications Apportées

### 1. Configuration Next.js (`next.config.ts`)

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Ignore Docusaurus documentation folder during Next.js build
  webpack (config, { isServer }) {
    if (isServer) {
      config.module.rules.push({
        test: /\.tsx?$/,
        include: /documentation/,
        use: 'null-loader'
      })
    }
    return config
  },

  // Rewrite /documentation/* to serve static files from public/documentation/*
  async rewrites () {
    return [
      {
        source: '/documentation',
        destination: '/documentation/index.html'
      },
      {
        source: '/documentation/:path*',
        destination: '/documentation/:path*'
      }
    ]
  }
}

export default nextConfig
```

**Fonctionnalités** :
- **Webpack config** : Ignore le dossier `documentation/` pendant le build Next.js (évite les conflits TypeScript)
- **Rewrites** : Redirige `/documentation` et `/documentation/*` vers les fichiers statiques dans `public/documentation/`

### 2. Script de Copie (`scripts/copy-docs.mjs`)

```javascript
import { cp, rm } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve } from 'path'

const src = resolve(process.cwd(), 'documentation', 'build')
const dest = resolve(process.cwd(), 'public', 'documentation')

async function main () {
  if (!existsSync(src)) {
    console.error(`Source docs build not found: ${src}`)
    console.error('Run "cd documentation && npm run build" first')
    process.exit(1)
  }

  // Remove existing destination if present
  try {
    await rm(dest, { recursive: true, force: true })
    console.log('Removed existing documentation folder')
  } catch (e) {
    // ignore
  }

  // Copy recursively
  try {
    await cp(src, dest, { recursive: true })
    console.log(`✅ Documentation copied from ${src} to ${dest}`)
  } catch (err) {
    console.error('❌ Failed to copy documentation:', err)
    process.exit(2)
  }
}

main()
```

**Fonctionnalités** :
- Copie `documentation/build/` vers `public/documentation/`
- Supprime l'ancienne version avant copie
- Validation de l'existence du build source

### 3. Scripts Package.json

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "npm run copy-docs && next build --turbopack",
    "start": "next start",
    "lint": "ts-standard --fix",
    "copy-docs": "node scripts/copy-docs.mjs",
    "docs:build": "cd documentation && npm run build",
    "docs:dev": "cd documentation && npm run start"
  }
}
```

**Nouveaux scripts** :
- `copy-docs` : Copie manuelle de la documentation
- `docs:build` : Build Docusaurus
- `docs:dev` : Serveur de développement Docusaurus (port 3002)

---

## 🚀 Utilisation

### Développement

```bash
# Lancer l'application Next.js
npm run dev
# Accéder à http://localhost:3000/documentation

# Ou lancer Docusaurus en standalone pour édition
npm run docs:dev
# Accéder à http://localhost:3002
```

### Production

```bash
# Build complet (copie docs + build Next.js)
npm run build

# Démarrer en production
npm start
# Documentation disponible sur /documentation
```

### Mise à jour de la documentation

```bash
# 1. Modifier les fichiers dans documentation/docs/
# 2. Rebuild Docusaurus
npm run docs:build

# 3. Copier dans public/
npm run copy-docs

# 4. (Optionnel) Rebuild Next.js
npm run build
```

---

## 📁 Structure des Fichiers

```
adopt-ton-triple-monstre/
├── documentation/              # Source Docusaurus
│   ├── docs/                  # Fichiers Markdown
│   ├── blog/                  # Articles de blog
│   ├── build/                 # Build Docusaurus (ignoré par Git)
│   └── docusaurus.config.ts
├── public/
│   └── documentation/         # Copie du build pour Next.js
│       ├── index.html
│       ├── docs/
│       ├── blog/
│       └── assets/
├── scripts/
│   └── copy-docs.mjs         # Script de copie
└── next.config.ts            # Configuration rewrites
```

---

## 🔍 Flux de Données

```
┌─────────────────────────────────────────────┐
│  Documentation Source (Markdown)            │
│  documentation/docs/*.md                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  Docusaurus Build   │
         │  npm run docs:build │
         └─────────┬───────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │  documentation/build/        │
    │  (HTML statique généré)      │
    └──────────────┬───────────────┘
                   │
                   ▼ copy-docs
         ┌─────────────────────┐
         │  public/documentation/│
         │  (Servi par Next.js) │
         └─────────┬───────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │  http://localhost:3000/      │
    │  documentation               │
    └──────────────────────────────┘
```

---

## ⚠️ Notes Importantes

### Git

Le dossier `public/documentation/` **doit être ignoré** par Git car il est généré automatiquement. Ajoutez dans `.gitignore` :

```gitignore
# Documentation build (auto-généré)
public/documentation/
```

Le dossier `documentation/build/` est déjà ignoré dans `documentation/.gitignore`.

### Déploiement Vercel

La commande de build `npm run build` inclut automatiquement `npm run copy-docs`, donc Vercel :

1. Exécute `npm run copy-docs` → Copie `documentation/build/` dans `public/`
2. Exécute `next build --turbopack` → Build Next.js avec la documentation

**Important** : Si le build Docusaurus (`documentation/build/`) n'existe pas, le script échouera. Dans ce cas, il faut soit :

- **Option 1** : Commiter `documentation/build/` dans Git (non recommandé, ~10MB)
- **Option 2** : Modifier le build command Vercel pour builder Docusaurus avant :
  ```bash
  cd documentation && npm install && npm run build && cd .. && npm run build
  ```

### Mise à jour Automatique

Pour regénérer automatiquement la documentation à chaque modification :

```bash
# Terminal 1 : Next.js dev
npm run dev

# Terminal 2 : Docusaurus watch mode
cd documentation
npm run start -- --watch

# Terminal 3 : Watch et copie auto (nécessite nodemon ou chokidar)
npx nodemon --watch documentation/build -x "npm run copy-docs"
```

---

## 🎯 Test de la Configuration

### Vérification manuelle

1. **Check du build Docusaurus** :
   ```bash
   ls documentation/build/index.html
   ```

2. **Check de la copie** :
   ```bash
   ls public/documentation/index.html
   ```

3. **Test de la route** :
   ```bash
   # Lancer le serveur
   npm run dev
   
   # Accéder à http://localhost:3000/documentation
   ```

### Vérification programmatique

```bash
# Tester que le fichier est servi
curl -I http://localhost:3000/documentation
# Doit retourner 200 OK avec Content-Type: text/html
```

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| `Source docs build not found` | Exécuter `npm run docs:build` dans le dossier `documentation/` |
| 404 sur `/documentation` | Vérifier que `public/documentation/index.html` existe |
| Styles cassés | Vérifier que `public/documentation/assets/` contient les CSS |
| Liens internes cassés | Le `baseUrl` dans `docusaurus.config.ts` doit être `/documentation/` |

---

## 📚 Ressources

- **Next.js Rewrites** : https://nextjs.org/docs/api-reference/next.config.js/rewrites
- **Docusaurus Config** : https://docusaurus.io/docs/configuration
- **Servir des fichiers statiques** : https://nextjs.org/docs/basic-features/static-file-serving

---

**Status** : ✅ **ROUTE /DOCUMENTATION FONCTIONNELLE**

La documentation Docusaurus est maintenant accessible sur `/documentation` via Next.js !
