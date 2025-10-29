# API Cron - Mise à jour automatique des monstres

Cette API permet de mettre à jour automatiquement et aléatoirement les états des monstres dans la base de données.

## 📍 Endpoint

```
GET/POST /api/cron/update-monsters
```

## 🔒 Sécurité (Optionnelle)

Pour sécuriser l'endpoint, définissez la variable d'environnement :

```env
# .env.local (pour dev) ou Vercel Environment Variables (pour prod)
CRON_SECRET_TOKEN=votre_token_secret_ici

# Pour le frontend (si vous utilisez le composant auto-updater)
NEXT_PUBLIC_CRON_SECRET_TOKEN=votre_token_secret_ici
```

Si `CRON_SECRET_TOKEN` n'est pas défini, l'endpoint sera accessible sans authentification.

## 🚀 Utilisation

### 1. Intégration automatique dans Next.js (Recommandé)

Le composant `MonstersAutoUpdater` est déjà intégré dans le dashboard et s'occupe automatiquement des mises à jour :

```tsx
// src/components/dashboard/dashboard-content.tsx
<MonstersAutoUpdater
  userId={session.user.id}
  minInterval={60000}   // 1 minute
  maxInterval={180000}  // 3 minutes
  enabled
  verbose
/>
```

### 2. Appel manuel via curl

```bash
# Sans authentification
curl http://localhost:3000/api/cron/update-monsters

# Avec authentification
curl -H "Authorization: Bearer votre_token_secret" \
  http://localhost:3000/api/cron/update-monsters

# Avec un userId spécifique
curl "http://localhost:3000/api/cron/update-monsters?userId=USER_ID_HERE"
```

### 3. Test dans le navigateur

Ouvrez simplement : `http://localhost:3000/api/cron/update-monsters`

### 4. Utilisation du hook React

```tsx
'use client'

import { useAutoUpdateMonsters } from '@/hooks/use-auto-update-monsters'

export function MyComponent() {
  const { trigger, isUpdating, lastUpdate, nextUpdateIn } = useAutoUpdateMonsters({
    userId: 'user123',
    minInterval: 60000,   // 1 minute minimum
    maxInterval: 180000,  // 3 minutes maximum
    enabled: true,
  })

  return (
    <div>
      <button onClick={trigger} disabled={isUpdating}>
        {isUpdating ? 'Mise à jour...' : 'Mettre à jour maintenant'}
      </button>
      
      {lastUpdate && (
        <p>
          {lastUpdate.success 
            ? `✅ ${lastUpdate.updated} monstre(s) mis à jour` 
            : `❌ Erreur: ${lastUpdate.error}`
          }
        </p>
      )}
      
      {nextUpdateIn && (
        <p className="text-sm text-gray-500">
          Prochaine mise à jour dans {Math.round(nextUpdateIn / 1000)}s
        </p>
      )}
    </div>
  )
}
```

## 📊 Réponse API

### Succès (200)

```json
{
  "success": true,
  "updated": 5,
  "timestamp": "2025-10-29T12:34:56.789Z",
  "duration": 234,
  "details": [
    {
      "id": "507f1f77bcf86cd799439011",
      "oldState": "hungry",
      "newState": "sleepy"
    }
  ]
}
```

### Erreur (401 - Non autorisé)

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### Erreur (500 - Erreur serveur)

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Connection to database failed",
  "timestamp": "2025-10-29T12:34:56.789Z",
  "duration": 123
}
```

## 📝 Logs

L'API génère des logs détaillés préfixés avec `[CRON-UPDATE-MONSTERS]` :

```
[2025-10-29T12:34:56.789Z] [CRON-UPDATE-MONSTERS] [INFO] 🚀 Démarrage de la mise à jour des monstres...
[2025-10-29T12:34:56.890Z] [CRON-UPDATE-MONSTERS] [INFO] ✅ Connecté à MongoDB
[2025-10-29T12:34:56.891Z] [CRON-UPDATE-MONSTERS] [INFO] 📊 5 monstre(s) trouvé(s)
[2025-10-29T12:34:56.892Z] [CRON-UPDATE-MONSTERS] [INFO] ✨ Monstre 507f... → hungry => sleepy
[2025-10-29T12:34:56.999Z] [CRON-UPDATE-MONSTERS] [INFO] ✅ Mise à jour terminée: 5 monstre(s) en 210ms
```

## 🎯 États possibles des monstres

Les états sont tirés aléatoirement parmi :
- `sad` (triste)
- `angry` (en colère)
- `hungry` (affamé)
- `sleepy` (endormi)

## ⚙️ Configuration

| Variable | Type | Description | Défaut |
|----------|------|-------------|--------|
| `minInterval` | number | Intervalle minimum entre mises à jour (ms) | 60000 (1 min) |
| `maxInterval` | number | Intervalle maximum entre mises à jour (ms) | 180000 (3 min) |
| `enabled` | boolean | Active/désactive les mises à jour auto | true |
| `verbose` | boolean | Active les logs détaillés | true |
| `showIndicator` | boolean | Affiche un indicateur visuel | false |

## 🔧 Dépannage

### Les mises à jour ne fonctionnent pas

1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs Vercel (si déployé)
3. Testez l'endpoint manuellement : `/api/cron/update-monsters`
4. Vérifiez la connexion MongoDB

### Erreur 401 Unauthorized

Vérifiez que `NEXT_PUBLIC_CRON_SECRET_TOKEN` correspond à `CRON_SECRET_TOKEN`

### Les logs n'apparaissent pas

Assurez-vous que `verbose={true}` dans le composant `MonstersAutoUpdater`

## 📁 Fichiers du système

- `src/app/api/cron/update-monsters/route.ts` - API Route Next.js
- `src/hooks/use-auto-update-monsters.ts` - Hook React pour auto-update
- `src/components/monsters/auto-updater.tsx` - Composant wrapper
- `src/components/dashboard/dashboard-content.tsx` - Intégration dashboard

## 🚀 Architecture

```
Dashboard (userId: session.user.id)
  └── MonstersAutoUpdater
      └── useAutoUpdateMonsters Hook
          └── POST /api/cron/update-monsters?userId=xxx
              └── MongoDB (Mongoose) update
```

## ✅ Avantages de cette approche

1. **Intégré dans Next.js** : Pas de service externe à gérer
2. **Contextuel** : Mise à jour uniquement des monstres de l'utilisateur connecté
3. **Intervalles aléatoires** : Comportement naturel (1-3 minutes par défaut)
4. **Pas de boucle infinie** : Architecture basée sur refs et timeouts
5. **Logs détaillés** : Facilite le debugging
6. **Sécurité optionnelle** : Token secret pour protéger l'endpoint

## 📚 Documentation complète

Consultez le dossier `docs/` pour plus de détails sur l'architecture et l'implémentation.
