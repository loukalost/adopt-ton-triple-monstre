# Système de Notifications Toast

## Vue d'ensemble

Le système de notifications utilise `react-toastify` pour fournir des retours visuels à l'utilisateur sur toutes les actions importantes de l'application. Les toasts sont stylisés pour s'aligner avec la palette de couleurs du projet (moccaccino, lochinvar, fuchsia-blue).

## Architecture

### Provider (`src/components/providers/toast-provider.tsx`)

Le `ToastProvider` est un composant client qui configure et affiche le conteneur de toasts avec :
- Position : `top-right`
- Durée : 3 secondes par défaut
- Thème : light avec styles personnalisés
- Animations : glisser, pausable au survol, déplaçable

**Intégration :**
```tsx
// src/app/layout.tsx
<body>
  {children}
  <ToastProvider />
</body>
```

### Helpers (`src/lib/toast.ts`)

Bibliothèque centralisée de fonctions pour afficher des notifications :

#### Notifications Basiques

```typescript
import { showSuccess, showError, showInfo, showWarning } from '@/lib/toast'

showSuccess('Opération réussie !')
showError('Une erreur est survenue')
showInfo('Information importante')
showWarning('Attention : vérifiez vos données')
```

#### Notifications Thématiques

##### Monster Actions
```typescript
import { monsterToasts } from '@/lib/toast'

// Actions sur les monstres
monsterToasts.feed()        // 🍖 Monstre nourri avec succès !
monsterToasts.comfort()     // 🛏️ Monstre réconforté !
monsterToasts.cuddle()      // 💕 Câlin donné au monstre !
monsterToasts.wake()        // ☀️ Monstre réveillé !

// CRUD operations
monsterToasts.created('Fluffy')     // 🎉 Fluffy a été créé avec succès !
monsterToasts.deleted('Fluffy')     // 👋 Fluffy a été supprimé
monsterToasts.updated('Fluffy')     // ✨ Fluffy a été mis à jour !

// Événements spéciaux
monsterToasts.levelUp('Fluffy', 5)  // 🎊 Fluffy est maintenant niveau 5 !
monsterToasts.stateChanged('happy') // État changé: happy
```

##### Authentication
```typescript
import { authToasts } from '@/lib/toast'

// Succès
authToasts.signInSuccess()   // ✅ Connexion réussie !
authToasts.signUpSuccess()   // 🎉 Compte créé avec succès !
authToasts.signOutSuccess()  // 👋 Déconnexion réussie

// Erreurs
authToasts.signInError()                    // ❌ Erreur de connexion
authToasts.signUpError('Email déjà utilisé') // ❌ Email déjà utilisé
authToasts.invalidCredentials()             // 🔐 Identifiants invalides
authToasts.emailAlreadyExists()             // 📧 Cet email existe déjà
authToasts.sessionExpired()                 // ⏰ Session expirée, reconnectez-vous
```

##### Validation de Formulaires
```typescript
import { validationToasts } from '@/lib/toast'

validationToasts.requiredField('Nom')         // ⚠️ Nom est requis
validationToasts.invalidFormat('Email')       // ⚠️ Format invalide pour Email
validationToasts.formSubmitted()              // ✅ Formulaire soumis !
validationToasts.formError()                  // ❌ Erreur lors de la soumission
```

#### Notifications avec Promesses

Pour les opérations asynchrones, affiche automatiquement les états pending/success/error :

```typescript
import { showLoadingToast } from '@/lib/toast'

const result = await showLoadingToast(
  fetchMonsterData(),
  {
    pending: '🔄 Chargement des données...',
    success: '✅ Données chargées !',
    error: '❌ Erreur de chargement'
  }
)
```

#### Toast Personnalisé

```typescript
import { showCustomToast } from '@/lib/toast'

showCustomToast('🎮', 'Nouveau niveau débloqué !', 'success')
showCustomToast('⚔️', 'Combat imminent', 'warning', { autoClose: 5000 })
```

#### Contrôle Global

```typescript
import { dismissAllToasts } from '@/lib/toast'

// Fermer tous les toasts actifs
dismissAllToasts()
```

## Intégrations dans l'Application

### Formulaire de Création de Monstre

```typescript
// src/components/forms/monster-form.tsx
import { monsterToasts, showError, showWarning } from '@/lib/toast'

// Validation
if (Object.keys(validation).length > 0) {
  showWarning('Veuillez remplir tous les champs requis')
  return
}

// Succès
await submission(payload)
monsterToasts.created(values.name) // 🎉 [Nom] a été créé avec succès !

// Erreur
catch (error) {
  showError(errorMsg)
}
```

### Formulaires d'Authentification

```typescript
// src/components/forms/signin-form.tsx
import { authToasts } from '@/lib/toast'

onSuccess: (ctx) => {
  authToasts.signInSuccess() // ✅ Connexion réussie !
},
onError: (ctx) => {
  authToasts.signInError()   // ❌ Erreur de connexion
}
```

### Dashboard

```typescript
// src/components/dashboard/dashboard-content.tsx
import { authToasts } from '@/lib/toast'

const handleLogout = (): void => {
  void authClient.signOut()
  authToasts.signOutSuccess() // 👋 Déconnexion réussie
  setTimeout(() => {
    window.location.href = '/sign-in'
  }, 500) // Délai pour voir le toast
}
```

### Gestion d'Erreurs

```typescript
// src/components/error-client.tsx
import { showError } from '@/lib/toast'

useEffect(() => {
  const errorMessage = typeof error === 'string'
    ? error
    : error instanceof Error
      ? error.message
      : 'An unexpected error occurred'
  
  showError(errorMessage)
  void redirectToDashboard()
}, [error])
```

## Styles Personnalisés

Les toasts utilisent des styles personnalisés alignés avec la palette du projet :

### Gradients de Couleur (`globals.css`)

```css
/* Succès - Lochinvar green */
.Toastify__toast--success {
  background: linear-gradient(135deg, #469086 0%, #5aa99e 100%);
}

/* Erreur - Moccaccino red */
.Toastify__toast--error {
  background: linear-gradient(135deg, #f7533c 0%, #ff6b57 100%);
}

/* Info - Fuchsia blue purple */
.Toastify__toast--info {
  background: linear-gradient(135deg, #8f72e0 0%, #a88ee8 100%);
}

/* Warning - Yellow/orange */
.Toastify__toast--warning {
  background: linear-gradient(135deg, #f7b731 0%, #ffd55f 100%);
}
```

### Personnalisation Visuelle

- **Border radius** : 12px pour des coins arrondis
- **Box shadow** : Ombre portée subtile
- **Progress bar** : Blanc semi-transparent
- **Bouton fermer** : Blanc avec opacité au survol
- **Font family** : Utilise la police du projet (Geist)

## Options de Configuration

### Options par Défaut

```typescript
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,        // 3 secondes
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
}
```

### Personnalisation par Toast

```typescript
showSuccess('Message', {
  autoClose: 5000,        // 5 secondes au lieu de 3
  position: 'bottom-left',
  hideProgressBar: true
})
```

## Principes SOLID Appliqués

### Single Responsibility
- **toast-provider.tsx** : Configure uniquement le conteneur
- **toast.ts** : Gère uniquement les notifications
- Chaque fonction a une responsabilité unique

### Open/Closed
- Extensible : Ajoutez facilement de nouvelles catégories de toasts
- Fermé : Les fonctions existantes n'ont pas besoin de modification

### Dependency Inversion
- Les composants dépendent de l'abstraction (`toast.ts`)
- Pas de couplage direct avec `react-toastify`

## Bonnes Pratiques

### ✅ À Faire

```typescript
// Utiliser les helpers thématiques
monsterToasts.created(name)

// Messages clairs et courts
showSuccess('Monstre créé !')

// Emojis pour le contexte visuel
showError('❌ Erreur de connexion')

// Durée adaptée au message
showSuccess('Long message...', { autoClose: 5000 })
```

### ❌ À Éviter

```typescript
// N'utilisez pas directement react-toastify
import { toast } from 'react-toastify'
toast.success('...') // ❌

// Messages trop longs
showSuccess('Votre monstre a été créé avec succès et ajouté à votre collection...') // ❌

// Pas de contexte
showError('Erreur') // ❌ Trop vague

// Trop de toasts simultanés
for (let i = 0; i < 10; i++) {
  showSuccess('Message') // ❌
}
```

## Tests Manuels

1. **Création de monstre** : Vérifier le toast de succès
2. **Connexion** : Toast de succès après connexion
3. **Déconnexion** : Toast d'info avant redirection
4. **Erreurs de formulaire** : Toast d'avertissement
5. **Erreurs réseau** : Toast d'erreur avec message clair

## Évolutions Futures

- [ ] Toasts avec actions (undo, retry)
- [ ] Sons de notification optionnels
- [ ] Position personnalisable par type
- [ ] Historique des notifications
- [ ] Notifications push (PWA)
- [ ] Toasts avec images/avatars
- [ ] Support du mode sombre
