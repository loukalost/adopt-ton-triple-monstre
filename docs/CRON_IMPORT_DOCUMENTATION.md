# Cron Worker System - Import Documentation

**Date**: October 29, 2025  
**Source**: https://github.com/RiusmaX/tamagotcho.git  
**Destination**: adopt-ton-triple-monstre/cron/

---

## 📦 Fichiers Importés

Le dossier `cron/` a été importé depuis le repository externe avec la structure complète suivante :

```
cron/
├── README.md          # Documentation basique
├── package.json       # Dépendances Node.js du worker
├── index.js          # Serveur Express + worker background
├── db.js             # Connexion MongoDB et logique de mise à jour
└── .gitignore        # Exclusions Git
```

---

## 🎯 Objectif du Système Cron

Le système cron est un **worker en arrière-plan** qui met à jour automatiquement l'état des monstres à intervalles aléatoires (entre 30 et 60 secondes). Cela simule les changements d'humeur naturels des Tamagotchi.

### Fonctionnalités

1. **Serveur Express** (port 3001 par défaut)
   - Route `/` : Message de bienvenue
   - Route `/health` : Vérification de santé du serveur

2. **Worker Background**
   - Boucle infinie qui s'exécute toutes les 30-60 secondes
   - Récupère tous les monstres de la base MongoDB
   - Met à jour aléatoirement leur état parmi : `['sad', 'angry', 'hungry', 'sleepy']`
   - Logs chaque mise à jour

3. **Graceful Shutdown**
   - Gestion des signaux SIGINT et SIGTERM
   - Fermeture propre du serveur
   - Nettoyage des timeouts en cours

---

## 🔧 Dépendances

### Package.json

```json
{
  "name": "cron",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "mongoose": "^8.9.3"
  }
}
```

| Package | Version | Usage |
|---------|---------|-------|
| **express** | ^4.21.2 | Serveur HTTP pour routes /health |
| **cors** | ^2.8.5 | Gestion CORS |
| **mongoose** | ^8.9.3 | ORM MongoDB pour accès base de données |
| **dotenv** | ^16.4.7 | Chargement variables d'environnement |

---

## 🗄️ Connexion MongoDB

### Fichier `db.js`

```javascript
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE_NAME}${process.env.MONGODB_PARAMS}&appName=${process.env.MONGODB_APP_NAME}`
```

**Variables d'environnement requises** (dans `.env.local` à la racine) :

- `MONGODB_USERNAME` : Nom d'utilisateur MongoDB Atlas
- `MONGODB_PASSWORD` : Mot de passe MongoDB Atlas
- `MONGODB_HOST` : Hôte du cluster (ex: `cluster0.xxxxx.mongodb.net`)
- `MONGODB_DATABASE_NAME` : Nom de la base (ex: `tamagotcho`)
- `MONGODB_PARAMS` : Paramètres supplémentaires (ex: `?retryWrites=true&w=majority`)
- `MONGODB_APP_NAME` : Nom de l'application (ex: `tamagotcho-cron`)

### Fonction `updateMonstersStates()`

```javascript
async function updateMonstersStates () {
  const monsters = await mongoose.connection.db.collection('monsters').find({}).toArray()
  
  for (const monster of monsters) {
    await mongoose.connection.db.collection('monsters').updateOne(
      { _id: monster._id },
      { $set: { state: MONSTER_STATES[Math.floor(Math.random() * MONSTER_STATES.length)] } }
    )
    
    console.info(`Updated monster ${monster._id} state to ${monster.state}`)
  }
}
```

**États possibles** : `['sad', 'angry', 'hungry', 'sleepy']`

---

## 🚀 Installation et Lancement

### 1. Installation des dépendances

```bash
cd cron
npm install
```

### 2. Configuration des variables d'environnement

Assurez-vous que le fichier `.env.local` à la **racine du projet** contient :

```bash
MONGODB_USERNAME=votre_username
MONGODB_PASSWORD=votre_password
MONGODB_HOST=cluster0.xxxxx.mongodb.net
MONGODB_DATABASE_NAME=adopt-ton-triple-monstre
MONGODB_PARAMS=?retryWrites=true&w=majority
MONGODB_APP_NAME=adopt-ton-triple-monstre-cron
```

### 3. Lancement du worker

#### Mode production
```bash
npm start
```

#### Mode développement (avec auto-reload)
```bash
npm run dev
```

**Sortie attendue** :

```
Server is running on port 3001
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/adopt-ton-triple-monstre?...
Mongoose connected to MongoDB database
[worker] run - 2025-10-29T14:30:00.000Z (delay 45000ms)
Updated monster 507f1f77bcf86cd799439011 state to sad
Updated monster 507f1f77bcf86cd799439012 state to hungry
...
```

---

## 📊 Architecture du Worker

### Boucle Infinie avec Délai Aléatoire

```javascript
const worker = async () => {
  while (!stopped) {
    const delay = Math.floor(Math.random() * 60000) + 30000 // 30s - 60s
    await new Promise((resolve) => {
      currentTimeout = setTimeout(resolve, delay)
    })
    
    if (stopped) break
    
    await updateMonstersStates()
  }
}
```

**Logique** :
1. Calcul d'un délai aléatoire entre 30 et 60 secondes
2. Attente du délai via `setTimeout`
3. Exécution de `updateMonstersStates()`
4. Répétition à l'infini (sauf si arrêt demandé)

### Gestion des Signaux

```javascript
const shutdown = (signal) => {
  stopped = true
  if (currentTimeout) clearTimeout(currentTimeout)
  
  server.close(() => {
    process.exit(0)
  })
  
  setTimeout(() => process.exit(1), 5000) // Force exit après 5s
}

process.on('SIGINT', () => shutdown('SIGINT'))   // Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')) // Kill signal
```

---

## 🔍 Routes HTTP Disponibles

### GET `/`

**Description** : Message de bienvenue

**Réponse** :
```
Hello from the cron server!
```

**Exemple** :
```bash
curl http://localhost:3001/
```

### GET `/health`

**Description** : Health check pour monitoring (Vercel, Docker, etc.)

**Réponse** :
```
Server is healthy
```

**Exemple** :
```bash
curl http://localhost:3001/health
```

---

## 🐛 Debugging

### Logs du Worker

Le worker affiche des logs détaillés :

```javascript
console.info('[worker] run -', new Date().toISOString(), `(delay ${delay}ms)`)
console.info(`Updated monster ${monster._id} state to ${monster.state}`)
console.error('[worker] error', err)
```

### Vérifier la connexion MongoDB

Si la connexion échoue, vérifiez :

1. Les variables d'environnement dans `.env.local`
2. Les permissions IP dans MongoDB Atlas (autoriser l'IP du serveur)
3. La validité des credentials

### Erreurs communes

| Erreur | Solution |
|--------|----------|
| `Error connecting to the database` | Vérifier MONGODB_URI et credentials |
| `Cannot find module 'mongoose'` | Exécuter `npm install` dans le dossier `cron/` |
| `EADDRINUSE: address already in use` | Un autre processus utilise le port 3001, changer `PORT` dans `.env.local` |

---

## 🚢 Déploiement

### Déploiement Local

```bash
# Terminal 1 : Application Next.js
npm run dev

# Terminal 2 : Worker cron
cd cron
npm start
```

### Déploiement Production (Vercel + Service Externe)

**Limitations** : Vercel Serverless Functions ont un timeout de 10-60 secondes maximum. Un worker en arrière-plan infini **ne peut pas tourner sur Vercel**.

**Solutions** :

1. **Heroku / Render / Railway**
   - Déployer le dossier `cron/` comme application Node.js séparée
   - Configurer les variables d'environnement
   - Le worker tournera 24/7

2. **Cron Job Externe (Vercel Cron + API Route)**
   - Créer une route API Next.js : `/api/cron/update-monsters`
   - Utiliser Vercel Cron Jobs pour appeler cette route toutes les minutes
   - Limité à 1 exécution/minute (pas de délais aléatoires)

3. **Cloud Functions (AWS Lambda, Google Cloud Functions)**
   - Déployer `updateMonstersStates()` comme fonction serverless
   - Scheduler via EventBridge (AWS) ou Cloud Scheduler (GCP)

**Recommandation** : Utiliser **Render** ou **Railway** pour un déploiement simple et gratuit du worker.

---

## 📝 Modifications Possibles

### Changer la fréquence des mises à jour

Dans `index.js`, modifier la ligne :

```javascript
// Actuellement : 30s - 60s
const delay = Math.floor(Math.random() * 60000) + 30000

// Exemple : 10s - 20s (plus rapide)
const delay = Math.floor(Math.random() * 10000) + 10000

// Exemple : 5min - 10min (plus lent)
const delay = Math.floor(Math.random() * 300000) + 300000
```

### Ajouter des états

Dans `db.js`, modifier :

```javascript
// Actuellement : 4 états négatifs
const MONSTER_STATES = ['sad', 'angry', 'hungry', 'sleepy']

// Avec états positifs
const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy', 'playful']
```

**Note** : Assurez-vous que ces états correspondent à l'enum `state` dans le modèle Mongoose `monster.model.ts` du projet principal.

### Ajouter des logs dans un fichier

```javascript
import fs from 'fs'

const logFile = 'cron.log'

console.info = (...args) => {
  const message = args.join(' ')
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${message}\n`)
  process.stdout.write(message + '\n')
}
```

---

## ⚠️ Considérations de Sécurité

1. **Variables d'environnement** : Ne jamais commiter `.env.local` dans Git
2. **MongoDB Atlas** : Activer l'authentification et restreindre les IPs autorisées
3. **Rate Limiting** : Le worker met à jour TOUS les monstres à chaque itération. Pour une base de données volumineuse (>1000 monstres), envisager un traitement par batch ou une limite de fréquence.
4. **Monitoring** : Utiliser la route `/health` pour surveiller l'état du worker avec des outils comme UptimeRobot ou Pingdom.

---

## 🔗 Intégration avec le Projet Principal

Le worker cron fonctionne de manière **indépendante** de l'application Next.js. Il partage uniquement :

- **La même base MongoDB** : Les deux accèdent à la collection `monsters`
- **Les mêmes variables d'environnement** : Définies dans `.env.local` à la racine

**Flux de données** :

```
┌─────────────────────────────────────────┐
│   Application Next.js (Port 3000)      │
│   - Créer/Lire/Afficher les monstres   │
│   - Interactions utilisateur            │
└──────────────┬──────────────────────────┘
               │
               ▼
     ┌─────────────────────┐
     │   MongoDB Atlas     │
     │   Collection:       │
     │   - monsters        │
     └─────────────────────┘
               ▲
               │
┌──────────────┴──────────────────────────┐
│   Worker Cron (Port 3001)               │
│   - Mise à jour automatique des états   │
│   - Toutes les 30-60 secondes           │
└─────────────────────────────────────────┘
```

---

## 📚 Ressources

- **Express.js** : https://expressjs.com/
- **Mongoose** : https://mongoosejs.com/
- **MongoDB Atlas** : https://www.mongodb.com/cloud/atlas
- **Node.js Worker Threads** : https://nodejs.org/api/worker_threads.html (alternative plus avancée)

---

## ✅ Résumé

| Aspect | Détails |
|--------|---------|
| **Fichiers créés** | 5 fichiers (README, package.json, index.js, db.js, .gitignore) |
| **Dépendances** | express, cors, mongoose, dotenv |
| **Port par défaut** | 3001 |
| **Fréquence** | 30-60 secondes (aléatoire) |
| **États modifiés** | `sad`, `angry`, `hungry`, `sleepy` |
| **Routes HTTP** | `/` (hello), `/health` (status) |
| **Déploiement** | Heroku, Render, Railway (pas Vercel Serverless) |

Le système cron est maintenant prêt à être utilisé pour simuler les changements d'humeur automatiques des monstres Tamagotchi ! 🎮

---

**Status** : ✅ **IMPORTATION COMPLÈTE** - Tous les fichiers du dossier cron ont été importés avec succès.
