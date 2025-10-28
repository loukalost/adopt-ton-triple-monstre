# Système de Génération Procédurale de Monstres

## Vue d'ensemble

Le système de génération procédurale permet de créer des monstres uniques avec des caractéristiques variées. Chaque monstre possède un ensemble de traits qui le rendent unique, incluant couleur, motif, taille, personnalité et caractéristiques spéciales.

## Architecture

### Types de Traits (`src/types/monsters/traits.ts`)

#### Traits Physiques
- **Couleurs** : 10 couleurs disponibles (crimson, coral, amber, lime, teal, azure, indigo, violet, rose, slate)
- **Motifs** : 5 motifs (solid, spotted, striped, gradient, sparkly)
- **Tailles** : 5 tailles (tiny, small, medium, large, huge)

#### Traits de Personnalité
- 8 personnalités : playful, shy, energetic, calm, curious, sleepy, mischievous, affectionate

#### Caractéristiques Spéciales
- 8 features : fluffy_tail, pointy_ears, big_eyes, small_horns, tiny_wings, whiskers, antenna, spiky_fur
- Chaque monstre possède entre 1 et 3 features aléatoires

### Service de Génération (`src/services/monster-generator.service.ts`)

#### Générateur Aléatoire avec Seed

Le service utilise un générateur de nombres pseudo-aléatoires avec seed pour permettre :
- **Reproductibilité** : Même seed = même monstre
- **Unicité** : Seeds différents = monstres différents
- **Cohérence** : Un utilisateur obtient toujours le même monstre starter

```typescript
// Générateur avec seed pour reproductibilité
const monster = generateMonsterTraits({ seed: 'user-123' })

// Générateur unique (basé sur timestamp)
const uniqueMonster = generateUniqueMonsterTraits()

// Monstre starter pour un utilisateur
const starter = generateStarterMonsterTraits(userId)
```

#### Fonctions Principales

| Fonction | Description | Use Case |
|----------|-------------|----------|
| `generateMonsterTraits(config)` | Génère des traits avec configuration | Tests, génération contrôlée |
| `generateUniqueMonsterTraits()` | Génère un monstre unique | Création de nouveaux monstres |
| `generateStarterMonsterTraits(userId)` | Génère un monstre starter | Premier monstre d'un utilisateur |
| `serializeTraits(traits)` | Convertit en JSON string | Stockage en base de données |
| `deserializeTraits(json)` | Parse depuis JSON string | Récupération depuis DB |
| `getTraitDescription(traits)` | Description lisible | Affichage utilisateur |

### Configuration de Génération

```typescript
interface TraitGenerationConfig {
  minFeatures?: number        // Nombre minimum de features (défaut: 1)
  maxFeatures?: number        // Nombre maximum de features (défaut: 3)
  excludeColors?: MonsterColor[]     // Couleurs à exclure
  excludePersonalities?: MonsterPersonality[]  // Personnalités à exclure
  seed?: string | number      // Seed pour reproductibilité
}
```

### Composants d'Affichage

#### MonsterTraitsDisplay
Affiche les traits d'un monstre avec deux variantes :
- **compact** : Vue condensée (badge de couleur + icônes)
- **detailed** : Vue complète avec tous les détails

```tsx
<MonsterTraitsDisplay traits={traits} variant='detailed' />
```

#### MonsterCard
Carte complète affichant le monstre avec :
- Nom et niveau
- Aperçu pixel art
- Traits détaillés
- Boutons d'action

```tsx
<MonsterCard monster={dbMonster} />
```

## Intégration dans le Formulaire

Le formulaire de création (`MonsterForm`) génère automatiquement les traits :

1. **Génération** : Click sur "Générer un monstre"
   - Génère un état aléatoire (happy, sad, angry, hungry, sleepy)
   - Génère un ensemble de traits uniques
   - Affiche l'aperçu avec `PixelBlackCat` et `MonsterTraitsDisplay`

2. **Sélection manuelle** : Boutons pour changer l'état
   - Garde les mêmes traits
   - Met à jour l'aperçu visuel

3. **Soumission** : Crée le monstre
   - Sérialise les traits en JSON
   - Stocke dans MongoDB avec le monstre

## Stockage en Base de Données

### Modèle Monster

```typescript
interface DBMonster {
  name: string
  level: number
  draw: string
  traits: string  // JSON sérialisé de MonsterTraits
  state: 'happy' | 'sad' | 'angry' | 'hungry' | 'sleepy'
  ownerId: string
  createdAt: Date
  updatedAt: Date
}
```

Le champ `traits` stocke les traits sous forme de JSON string :
```json
{
  "color": "azure",
  "pattern": "spotted",
  "size": "medium",
  "personality": "playful",
  "features": ["big_eyes", "fluffy_tail"],
  "birthTimestamp": 1698528000000
}
```

## Principes Clean Code & SOLID Appliqués

### Single Responsibility
- **Types** : Définition pure des structures de données
- **Service** : Logique de génération uniquement
- **Composants** : Affichage uniquement

### Open/Closed
- Nouveau trait ? Ajoutez-le aux constantes sans modifier la logique
- Nouvelles variantes d'affichage ? Extend `MonsterTraitsDisplay`

### Dependency Inversion
- Composants dépendent des interfaces (`MonsterTraits`)
- Pas de couplage avec l'implémentation de génération

### Interface Segregation
- Types séparés pour génération (`TraitGenerationConfig`)
- Types séparés pour affichage (`MonsterTraitsDisplayProps`)

## Tests

Fichier de tests : `src/services/__tests__/monster-generator.test.ts`

Tests couverts :
- ✓ Génération avec seed reproductible
- ✓ Génération unique
- ✓ Monstre starter cohérent
- ✓ Sérialisation/désérialisation
- ✓ Description lisible
- ✓ Configuration personnalisée

## Exemples d'Utilisation

### Créer un monstre unique
```typescript
const traits = generateUniqueMonsterTraits()
const monster = new MonsterModel({
  name: 'Fluffy',
  level: 1,
  draw: 'black-cat',
  traits: serializeTraits(traits),
  state: 'happy',
  ownerId: userId
})
await monster.save()
```

### Afficher les traits d'un monstre existant
```typescript
const monster = await MonsterModel.findById(monsterId)
const traits = deserializeTraits(monster.traits)
return <MonsterTraitsDisplay traits={traits} variant='detailed' />
```

### Générer un monstre avec contraintes
```typescript
const traits = generateMonsterTraits({
  seed: Date.now(),
  minFeatures: 2,
  maxFeatures: 3,
  excludeColors: ['slate'],
  excludePersonalities: ['sleepy']
})
```

## Évolutions Futures

- [ ] Système d'évolution des traits avec le niveau
- [ ] Héritage de traits entre monstres (breeding)
- [ ] Traits rares/légendaires avec probabilités
- [ ] Visualisation dynamique basée sur les traits
- [ ] Export/import de monstres via QR code
- [ ] Galerie de tous les monstres générés
