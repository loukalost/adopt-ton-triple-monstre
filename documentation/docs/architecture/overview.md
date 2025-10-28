---
sidebar_position: 1
---

# Vue d'Ensemble de l'Architecture

## Principes Fondamentaux

Adopt ton Triple Monstre est construit selon les principes **SOLID** et **Clean Architecture**, garantissant un code maintenable, testable et extensible.

## Clean Architecture

L'application est organisée en couches avec des dépendances unidirectionnelles pointant vers l'intérieur :

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (UI)             │
│      src/components/, src/app/              │
│   React Components, Pages, Layouts          │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│       Application Layer (Use Cases)         │
│          src/app/api/, Forms                │
│    Server Actions, API Routes, Handlers     │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│         Domain Layer (Business)             │
│         src/services/, src/types/           │
│   Business Logic, Entities, Interfaces      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│     Infrastructure Layer (External)         │
│         src/db/, src/lib/, public/          │
│    Database, Auth, PWA, External APIs       │
└─────────────────────────────────────────────┘
```

### Règles de Dépendances

1. **Les couches externes dépendent des couches internes**, jamais l'inverse
2. **Le domaine** ne dépend de rien (pure business logic)
3. **L'infrastructure** est isolée et interchangeable
4. **La présentation** ne contient pas de logique métier

## Principes SOLID

### Single Responsibility Principle (SRP)

Chaque module a une seule raison de changer.

**Exemples dans le projet** :
- `monster-generator.service.ts` : Génération de monstres uniquement
- `toast.ts` : Gestion des notifications uniquement
- `pwa.ts` : Utilitaires PWA uniquement

```typescript
// ❌ Mauvais : Responsabilités multiples
class MonsterManager {
  generateMonster() { /* ... */ }
  saveToDatabase() { /* ... */ }
  sendNotification() { /* ... */ }
}

// ✅ Bon : Responsabilités séparées
class MonsterGenerator {
  generateMonster() { /* ... */ }
}
class MonsterRepository {
  save() { /* ... */ }
}
class NotificationService {
  notify() { /* ... */ }
}
```

### Open/Closed Principle (OCP)

Ouvert à l'extension, fermé à la modification.

**Exemples dans le projet** :
- Composants Button avec variants extensibles
- Service de génération configurable par options

```typescript
// Configuration extensible sans modifier le code
generateMonsterTraits({
  minFeatures: 2,
  maxFeatures: 4,
  excludeColors: ['slate'],
  seed: 'custom-seed'
})
```

### Liskov Substitution Principle (LSP)

Les sous-types doivent être substituables à leurs types de base.

**Exemples dans le projet** :
- Variants de boutons interchangeables
- Stratégies de cache interchangeables

### Interface Segregation Principle (ISP)

Les clients ne doivent pas dépendre d'interfaces qu'ils n'utilisent pas.

**Exemples dans le projet** :
- Interfaces spécifiques par composant
- Props TypeScript précis et ciblés

```typescript
// ❌ Mauvais : Interface trop large
interface MonsterProps {
  id: string
  name: string
  level: number
  traits: MonsterTraits
  onEdit: () => void
  onDelete: () => void
  onLevelUp: () => void
  onFeed: () => void
  // ... 20 autres props
}

// ✅ Bon : Interfaces spécifiques
interface MonsterDisplayProps {
  monster: DBMonster
}
interface MonsterActionsProps {
  monsterId: string
  onAction: (action: string) => void
}
```

### Dependency Inversion Principle (DIP)

Dépendre des abstractions, pas des implémentations concrètes.

**Exemples dans le projet** :
- Services utilisent des interfaces, pas des implémentations directes
- Dependency injection pour les services

## Structure des Dossiers

### `src/app/` - Application Layer

Pages Next.js et API routes suivant l'App Router.

```
app/
├── layout.tsx              # Layout racine
├── page.tsx                # Page d'accueil
├── globals.css             # Styles globaux
├── api/                    # API Routes
│   └── auth/[...all]/      # Routes Better Auth
├── dashboard/              # Dashboard protégé
│   └── page.tsx
└── sign-in/                # Page de connexion
    └── page.tsx
```

### `src/components/` - Presentation Layer

Composants React réutilisables organisés par domaine.

```
components/
├── buttons/                # Boutons réutilisables
│   └── button.tsx
├── dashboard/              # Composants dashboard
│   └── dashboard-content.tsx
├── forms/                  # Formulaires
│   ├── auth-form-content.tsx
│   ├── signin-form.tsx
│   ├── signup-form.tsx
│   └── monster-form.tsx
├── inputs/                 # Inputs personnalisés
│   └── input.tsx
├── monsters/               # Composants monstres
│   ├── monster-card.tsx
│   ├── monster-traits-display.tsx
│   └── pixel-black-cat.tsx
├── pwa/                    # Composants PWA
│   ├── install-prompt.tsx
│   └── pwa-registration.tsx
├── providers/              # Providers React
│   └── toast-provider.tsx
└── sections/               # Sections de pages
    ├── header.tsx
    ├── footer.tsx
    └── hero-section.tsx
```

### `src/services/` - Domain Layer

Services métier contenant la logique business.

```
services/
└── monster-generator.service.ts  # Génération procédurale
```

### `src/db/` - Infrastructure Layer

Base de données et modèles.

```
db/
├── index.ts                # Connection manager
└── models/
    └── monster.model.ts    # Modèle Mongoose
```

### `src/lib/` - Infrastructure Layer

Bibliothèques et utilitaires externes.

```
lib/
├── auth.ts                 # Configuration Better Auth
├── auth-client.ts          # Client Better Auth
├── pwa.ts                  # Utilitaires PWA
└── toast.ts                # Helpers toast
```

### `src/types/` - Domain Layer

Types et interfaces TypeScript.

```
types/
├── components.ts           # Types composants
├── forms/                  # Types formulaires
│   ├── auth-form.ts
│   └── monster-form.ts
└── monsters/               # Types monstres
    └── traits.ts
```

## Patterns de Conception

### Repository Pattern

Abstraction de l'accès aux données.

```typescript
// Interface (domaine)
interface MonsterRepository {
  findById(id: string): Promise<Monster | null>
  save(monster: Monster): Promise<Monster>
  delete(id: string): Promise<void>
}

// Implémentation Mongoose (infrastructure)
class MongooseMonsterRepository implements MonsterRepository {
  async findById(id: string) {
    return await MonsterModel.findById(id)
  }
  // ...
}
```

### Service Pattern

Encapsulation de la logique métier.

```typescript
// Service (domaine)
class MonsterGeneratorService {
  generateMonsterTraits(config?: GenerationConfig): MonsterTraits {
    // Logique métier pure
  }
}
```

### Provider Pattern

Gestion du state et des contextes React.

```typescript
// Provider (présentation)
export default function ToastProvider() {
  return <ToastContainer {...config} />
}
```

### Factory Pattern

Création d'objets complexes.

```typescript
// Factory pour génération de monstres
function createMonster(userId: string): Monster {
  return {
    name: generateName(),
    traits: generateStarterMonsterTraits(userId),
    ownerId: userId,
    // ...
  }
}
```

## Conventions de Code

### Naming Conventions

- **Components** : PascalCase (`MonsterCard.tsx`)
- **Files** : kebab-case (`monster-generator.service.ts`)
- **Functions** : camelCase (`generateMonsterTraits`)
- **Types/Interfaces** : PascalCase (`MonsterTraits`)
- **Constants** : UPPER_SNAKE_CASE (`DEFAULT_LEVEL`)

### File Organization

```typescript
// 1. Imports
import { useState } from 'react'
import type { Monster } from '@/types'

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Constants
const DEFAULT_VALUE = 10

// 4. Helper Functions
function helperFunction() {
  // ...
}

// 5. Main Component/Service
export default function Component() {
  // ...
}
```

### Function Size

- **Petites fonctions** : < 20 lignes idéalement
- **Une seule responsabilité** par fonction
- **Nom descriptif** expliquant ce que fait la fonction

### Code Comments

```typescript
// ❌ Mauvais : Commentaire inutile
// Incrémente i
i++

// ✅ Bon : Explique le pourquoi
// Skip caching for admin users to ensure fresh data
if (user.isAdmin) {
  return await fetchFreshData()
}
```

## Testing Strategy

### Unit Tests

Tests des fonctions pures et services.

```typescript
// Example : monster-generator.test.ts
describe('MonsterGenerator', () => {
  it('should generate consistent traits with same seed', () => {
    const traits1 = generateMonsterTraits({ seed: 'test' })
    const traits2 = generateMonsterTraits({ seed: 'test' })
    expect(traits1).toEqual(traits2)
  })
})
```

### Integration Tests

Tests des interactions entre couches.

### E2E Tests

Tests du parcours utilisateur complet.

## Performance Considerations

### Code Splitting

Next.js gère automatiquement le code splitting par route.

### Lazy Loading

```typescript
// Chargement différé des composants lourds
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />
})
```

### Memoization

```typescript
// Éviter les re-renders inutiles
const expensiveValue = useMemo(() => computeExpensive(data), [data])
```

### Database Indexes

```typescript
// Indexes Mongoose pour performances
MonsterSchema.index({ ownerId: 1, createdAt: -1 })
```

## Security Best Practices

### Input Validation

- Validation côté serveur obligatoire
- Sanitization des entrées utilisateur
- Schema validation avec Mongoose

### Authentication

- Sessions sécurisées avec Better Auth
- CSRF protection intégrée
- OAuth avec tokens sécurisés

### Data Access

- Authorization checks sur chaque requête
- Isolation des données par utilisateur
- No direct database exposure

## Monitoring & Logging

### Development

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('[Debug] Monster created:', monster)
}
```

### Production

- Structured logging
- Error tracking (Sentry recommended)
- Performance monitoring

## Conclusion

Cette architecture garantit :

- ✅ **Maintenabilité** : Code organisé et prévisible
- ✅ **Testabilité** : Couches isolées et testables
- ✅ **Extensibilité** : Ajout de features sans refactoring majeur
- ✅ **Performance** : Optimisations ciblées par couche
- ✅ **Sécurité** : Séparation des préoccupations

Pour plus de détails sur une couche spécifique, consultez les sections dédiées de la documentation.
