# Progressive Web App (PWA) - Documentation

## Vue d'Ensemble

Adopt ton Triple Monstre est configuré comme une Progressive Web App (PWA), offrant :
- ✅ Installation sur l'écran d'accueil (mobile & desktop)
- ✅ Fonctionnement hors ligne avec cache stratégique
- ✅ Chargement rapide avec précache des ressources essentielles
- ✅ Expérience app-like en plein écran
- ✅ Notifications push (préparé pour future implémentation)
- ✅ Mise à jour automatique en arrière-plan

## Architecture PWA

### 1. Manifest (`public/manifest.json`)

Le fichier manifest définit l'identité et le comportement de l'application :

```json
{
  "name": "Adopt ton Triple Monstre",
  "short_name": "Triple Monstre",
  "description": "Adoptez et prenez soin de vos petits monstres virtuels !",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#f7533c",
  "background_color": "#ffffff"
}
```

**Propriétés Clés :**
- `display: "standalone"` - Mode plein écran sans barre d'adresse
- `orientation: "portrait-primary"` - Optimisé pour portrait (jeu mobile)
- `theme_color` - Couleur moccaccino-500 (#f7533c) pour cohérence visuelle
- `scope: "/"` - Toutes les pages de l'app sont incluses dans la PWA

### 2. Service Worker (`public/sw.js`)

Gère le cache et le fonctionnement hors ligne avec deux stratégies :

#### Stratégie "Network First" (Pages HTML)
```javascript
// Pour les pages de navigation
fetch(request)
  .then(response => {
    // Cache la réponse pour utilisation offline
    cache.put(request, response.clone())
    return response
  })
  .catch(() => {
    // Fallback au cache si offline
    return caches.match(request)
  })
```

**Utilisé pour :**
- `/` (page d'accueil)
- `/dashboard` (tableau de bord)
- `/sign-in` (authentification)

**Avantages :**
- Toujours à jour quand connecté
- Fonctionne hors ligne avec dernière version cachée

#### Stratégie "Cache First" (Assets Statiques)
```javascript
// Pour CSS, JS, images
caches.match(request)
  .then(cached => cached || fetch(request))
```

**Utilisé pour :**
- Fichiers CSS/JS
- Images et icônes
- Polices

**Avantages :**
- Chargement instantané
- Économie de bande passante

#### Précache des Ressources Essentielles
```javascript
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/sign-in',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]
```

Ces ressources sont mises en cache immédiatement lors de l'installation du service worker.

### 3. Bibliothèque PWA (`src/lib/pwa.ts`)

Utilitaires pour gérer la PWA côté client :

```typescript
// Enregistrer le service worker
await registerServiceWorker()

// Vérifier si l'app est installée
const installed = isPWA()

// Désinstaller le service worker (debug)
await unregisterServiceWorker()
```

### 4. Composant d'Installation (`src/components/pwa/install-prompt.tsx`)

Affiche une invitation élégante à installer l'app :

```tsx
<InstallPrompt />
```

**Comportement :**
- Détecte automatiquement si le navigateur supporte l'installation
- Se cache si l'app est déjà installée ou en mode PWA
- Mémorise le refus pour ne pas être intrusif
- Animation slide-up fluide

**Design :**
- Positionnement responsive (bottom-left mobile, bottom-right desktop)
- Icône 📱 pour identifier l'action
- Boutons "Installer" (primary) et "Plus tard" (ghost)
- Bouton de fermeture discret

### 5. Enregistrement Automatique (`src/components/pwa/pwa-registration.tsx`)

Composant sans UI qui enregistre le service worker au chargement :

```tsx
// Dans layout.tsx
<PWARegistration />
```

**Logique :**
- Enregistrement uniquement en production
- Vérification des mises à jour toutes les 60 secondes
- Gestion automatique des erreurs

## Configuration du Projet

### Layout Root (`src/app/layout.tsx`)

Métadonnées PWA complètes :

```tsx
export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Triple Monstre'
  },
  themeColor: '#f7533c',
  // ... autres métadonnées
}
```

**Balises HTML Ajoutées :**
```html
<link rel="manifest" href="/manifest.json" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Triple Monstre" />
<meta name="theme-color" content="#f7533c" />
```

### Configuration Next.js (`next.config.ts`)

Aucune configuration spéciale requise avec Next.js 15 - le manifest et le service worker sont servis automatiquement depuis `/public`.

## Icônes PWA

### Tailles Requises

**Minimum Requis (PWA valide) :**
- `icon-192x192.png` (192x192px)
- `icon-512x512.png` (512x512px)

**Recommandé (Expérience Complète) :**
- 72x72, 96x96, 128x128, 144x144, 152x152, 180x180, 192x192, 384x384, 512x512
- Icônes maskables pour Android (192x192, 512x512)
- Tuiles Windows (70x70, 150x150, 310x310, 310x150)
- Icônes de raccourcis (96x96)

### Génération des Icônes

Consultez la documentation complète : [`docs/PWA_ICONS_GENERATION.md`](./PWA_ICONS_GENERATION.md)

**Méthodes Disponibles :**
1. Outil en ligne : [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
2. Script Node.js avec Sharp
3. Commandes ImageMagick

## Installation et Test

### 1. Installation Utilisateur

#### Sur Mobile (Android/iOS)
1. Ouvrir l'app dans le navigateur
2. Cliquer sur "Installer" dans le prompt
   - Ou menu navigateur > "Ajouter à l'écran d'accueil"
3. L'icône apparaît sur l'écran d'accueil
4. Ouvrir comme une app native

#### Sur Desktop (Chrome/Edge)
1. Icône d'installation dans la barre d'adresse
2. Ou menu > "Installer Triple Monstre..."
3. L'app s'ouvre dans sa propre fenêtre

### 2. Test de Développement

#### Vérifier le Manifest
```bash
# Ouvrir DevTools > Application > Manifest
# Vérifier :
# - Nom et description
# - Icônes chargées correctement
# - Theme color appliquée
```

#### Tester le Service Worker
```bash
# DevTools > Application > Service Workers
# Vérifier :
# - Status "Activated"
# - Scope correct
# - Mises à jour fonctionnelles
```

#### Tester le Cache
```bash
# DevTools > Application > Cache Storage
# Vérifier :
# - triple-monstre-v1 (precache)
# - runtime-cache-v1 (runtime)
# - Ressources cachées correctement
```

#### Simuler Mode Offline
```bash
# DevTools > Network > Throttling > Offline
# Naviguer dans l'app
# Vérifier :
# - Pages précédemment visitées accessibles
# - Images et styles chargés depuis le cache
```

#### Audit Lighthouse
```bash
# DevTools > Lighthouse
# Sélectionner "Progressive Web App"
# Score cible : ≥ 90
```

**Critères Lighthouse PWA :**
- ✅ Répond avec 200 quand offline
- ✅ Manifest valide avec icônes
- ✅ Theme color définie
- ✅ Viewport configuré
- ✅ Service worker enregistré
- ✅ Redirections HTTPS
- ✅ Splash screen custom

### 3. Build de Production

```bash
# Build l'application
npm run build

# Tester en production locale
npm start

# Ou avec serveur statique
npx serve@latest out -p 3000
```

**Important :** Le service worker ne fonctionne qu'en production (`NODE_ENV=production`).

## Fonctionnalités Offline

### Pages Accessibles Hors Ligne
- ✅ Page d'accueil (`/`)
- ✅ Dashboard (`/dashboard`)
- ✅ Page de connexion (`/sign-in`)
- ✅ Pages précédemment visitées

### Limitations Offline
- ❌ Authentification (requiert serveur)
- ❌ Création/modification de monstres (requiert DB)
- ❌ Données temps réel

### Stratégie de Dégradation Gracieuse
```typescript
// Exemple dans un composant
const [isOnline, setIsOnline] = useState(navigator.onLine)

useEffect(() => {
  const handleOnline = () => setIsOnline(true)
  const handleOffline = () => setIsOnline(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [])

if (!isOnline) {
  return <OfflineMessage />
}
```

## Notifications Push (Préparé)

Le service worker inclut la logique pour les notifications push :

```javascript
self.addEventListener('push', (event) => {
  const options = {
    body: 'Votre monstre a besoin de vous !',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    actions: [
      { action: 'explore', title: 'Voir mes monstres' },
      { action: 'close', title: 'Fermer' }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Triple Monstre', options)
  )
})
```

**Pour Activer (Future Feature) :**
1. Configurer un service de push (Firebase Cloud Messaging, OneSignal, etc.)
2. Demander la permission utilisateur
3. Enregistrer le token push
4. Envoyer des notifications depuis le backend

## Raccourcis d'Application

Le manifest définit des raccourcis pour actions rapides :

```json
{
  "shortcuts": [
    {
      "name": "Créer un monstre",
      "url": "/dashboard?action=create",
      "icons": [{ "src": "/icons/shortcut-create.png", "sizes": "96x96" }]
    }
  ]
}
```

**Support :**
- Android : Menu contextuel long-press sur l'icône
- Windows : Clic droit sur l'icône dans la barre des tâches
- macOS : Bientôt disponible

## Mises à Jour du Service Worker

### Processus Automatique
1. Le navigateur vérifie périodiquement le fichier `sw.js`
2. Si changement détecté, télécharge le nouveau worker
3. Nouvelle version activée au prochain chargement de page

### Forcer une Mise à Jour
```javascript
// Dans DevTools Console
navigator.serviceWorker.getRegistration()
  .then(reg => reg.update())
```

### Gestion de Version
```javascript
// Dans sw.js - incrémenter à chaque changement
const CACHE_NAME = 'triple-monstre-v2' // v1 → v2
```

## Bonnes Pratiques Appliquées

### 1. Single Responsibility Principle
- `pwa.ts` : Gestion service worker
- `install-prompt.tsx` : UI d'installation uniquement
- `pwa-registration.tsx` : Enregistrement automatique

### 2. Offline-First Strategy
- Précache des ressources critiques
- Fallback gracieux si cache vide
- Stratégies adaptées au type de contenu

### 3. Performance
- Cache stratégique réduit les requêtes réseau
- Ressources statiques servies instantanément
- Mise à jour en background sans bloquer l'utilisateur

### 4. User Experience
- Installation non intrusive (prompt dismissible)
- Indication claire du statut offline/online
- Transitions fluides entre cache et réseau

### 5. Progressive Enhancement
- Fonctionne comme site web sans PWA
- Amélioration progressive si support PWA
- Graceful degradation si service worker échoue

## Débogage

### Problèmes Courants

#### Service Worker ne s'enregistre pas
```bash
# Vérifier la console
# Erreur commune : fichier sw.js introuvable
# Solution : vérifier que sw.js est dans /public
```

#### Cache ne se met pas à jour
```bash
# DevTools > Application > Service Workers
# Cliquer "Unregister" puis rafraîchir
# Ou incrémenter CACHE_NAME dans sw.js
```

#### Prompt d'installation n'apparaît pas
```bash
# Prérequis :
# - HTTPS (ou localhost)
# - Manifest valide
# - Service worker actif
# - Icônes 192x192 et 512x512 présentes
# - Pas déjà installé
```

#### Mode Offline ne fonctionne pas
```bash
# Vérifier que les ressources sont dans le cache :
# DevTools > Application > Cache Storage
# Si vide : problème d'enregistrement du SW
```

### Logs de Débogage

Activer les logs détaillés :

```javascript
// Dans sw.js (en haut)
const DEBUG = true

if (DEBUG) console.log('[SW] Install event')
```

## Checklist de Déploiement PWA

Avant de mettre en production :

- [ ] Icônes générées (minimum 192x192 et 512x512)
- [ ] Manifest validé (https://manifest-validator.appspot.com/)
- [ ] Icônes maskables testées (https://maskable.app/)
- [ ] Service worker testé en mode offline
- [ ] Score Lighthouse PWA ≥ 90
- [ ] HTTPS configuré (requis pour PWA)
- [ ] Métadonnées à jour (nom, description, couleurs)
- [ ] Screenshots ajoutés au manifest (optionnel mais recommandé)
- [ ] Raccourcis testés sur Android/Windows
- [ ] Installation testée sur mobile et desktop

## Ressources

### Documentation Officielle
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev - PWA](https://web.dev/progressive-web-apps/)
- [Chrome DevTools - PWA](https://developer.chrome.com/docs/devtools/progressive-web-apps/)

### Outils
- [PWA Builder](https://www.pwabuilder.com/) - Générateur et validateur PWA
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit PWA
- [Maskable.app](https://maskable.app/) - Testeur d'icônes adaptatives
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Générateur d'icônes

### Standards
- [W3C Web App Manifest](https://www.w3.org/TR/appmanifest/)
- [Service Worker Spec](https://www.w3.org/TR/service-workers/)
- [Web Capabilities (Fugu)](https://developer.chrome.com/blog/fugu-status/)

## Prochaines Étapes

### Améliorations Futures
1. **Notifications Push**
   - Intégrer Firebase Cloud Messaging
   - Notifier quand monstre a faim/triste
   - Rappels quotidiens

2. **Synchronisation Background**
   - API Background Sync pour actions offline
   - File d'attente de requêtes en attente de connexion

3. **Mode Offline Avancé**
   - IndexedDB pour stockage local complet
   - Synchronisation bidirectionnelle

4. **App Shortcuts Dynamiques**
   - Raccourcis vers monstres favoris
   - Actions contextuelles

5. **Share Target**
   - Partager des monstres depuis d'autres apps
   - Intégration Share API

## Support Navigateurs

| Fonctionnalité | Chrome | Firefox | Safari | Edge |
|----------------|--------|---------|--------|------|
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Web Manifest | ✅ | ✅ | ✅ | ✅ |
| Install Prompt | ✅ | ❌ | ❌ | ✅ |
| Maskable Icons | ✅ | ❌ | ❌ | ✅ |
| Shortcuts | ✅ | ❌ | ❌ | ✅ |
| Push Notifications | ✅ | ✅ | ✅* | ✅ |

*Safari iOS 16.4+ uniquement

## Conclusion

La configuration PWA d'Adopt ton Triple Monstre offre une expérience moderne et performante :
- Installation native sur tous les appareils
- Fonctionnement offline pour accessibilité constante
- Chargement instantané avec stratégies de cache optimisées
- Extensibilité pour fonctionnalités avancées (push, sync, etc.)

L'architecture respecte les principes SOLID et clean code, avec séparation claire des responsabilités et documentation exhaustive.
