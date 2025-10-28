------

sidebar_position: 1sidebar_position: 1

------



# Bienvenue# Tutorial Intro



Bienvenue dans la documentation d'**Adopt ton Triple Monstre** ! 🎮Let's discover **Docusaurus in less than 5 minutes**.



## À propos du projet## Getting Started



Adopt ton Triple Monstre est un jeu Tamagotchi moderne construit avec Next.js 15, React 19, et TypeScript. Adoptez et prenez soin de vos petits monstres virtuels avec des créatures uniques générées procéduralement !Get started by **creating a new site**.



## Caractéristiques principalesOr **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**.



### 🎨 Génération Procédurale### What you'll need

- **400+ combinaisons uniques** : 10 couleurs × 5 motifs × 8 personnalités

- Traits générés aléatoirement mais reproductibles- [Node.js](https://nodejs.org/en/download/) version 20.0 or above:

- Chaque monstre est unique avec ses propres caractéristiques  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.



### 🔐 Authentification Sécurisée## Generate a new site

- Email/mot de passe avec Better Auth

- OAuth GitHub intégréGenerate a new Docusaurus site using the **classic template**.

- Gestion de session sécurisée

The classic template will automatically be added to your project after you run the command:

### 💾 Base de Données MongoDB

- Stockage persistant des monstres```bash

- Indexes optimisés pour les performancesnpm init docusaurus@latest my-website classic

- Validation des données côté serveur```



### 📱 Progressive Web App (PWA)You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

- Installation sur écran d'accueil

- Fonctionnement hors ligneThe command also installs all necessary dependencies you need to run Docusaurus.

- Chargement instantané depuis le cache

- 19 icônes pour tous les appareils## Start your site



### 🔔 Notifications ToastRun the development server:

- 30+ helpers contextuels

- Styles personnalisés avec gradients```bash

- Feedback immédiat pour l'utilisateurcd my-website

npm run start

## Stack Technique```



```The `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there.

Framework        Next.js 15.5.4 (App Router + Turbopack)

UI               React 19.1.0The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at http://localhost:3000/.

Language         TypeScript (strict mode)

Styling          Tailwind CSS 4Open `docs/intro.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes.

Base de données  MongoDB Atlas + Mongoose 8.x
Authentification Better Auth 1.3.33
Notifications    react-toastify
PWA              Service Worker + Web App Manifest
Qualité          ts-standard + ESLint
```

## Architecture

Le projet suit les principes **SOLID** et **Clean Architecture** :

- **Presentation Layer** : Composants React (`src/components/`)
- **Application Layer** : Pages Next.js (`src/app/`)
- **Domain Layer** : Services métier (`src/services/`)
- **Infrastructure Layer** : Base de données, APIs externes

## Démarrage Rapide

### Prérequis

- Node.js 18+ 
- npm ou yarn
- MongoDB Atlas account (ou MongoDB local)
- Git

### Installation

```bash
# Cloner le repository
git clone https://github.com/loukalost/adopt-ton-triple-monstre.git
cd adopt-ton-triple-monstre

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos credentials

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Variables d'environnement requises

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Better Auth
BETTER_AUTH_SECRET=votre-secret-aleatoire
BETTER_AUTH_URL=http://localhost:3000

# GitHub OAuth (optionnel)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## Structure du Projet

```
adopt-ton-triple-monstre/
├── src/
│   ├── app/                 # Pages Next.js (App Router)
│   │   ├── api/             # API Routes
│   │   ├── dashboard/       # Dashboard page
│   │   └── sign-in/         # Authentication page
│   ├── components/          # Composants React
│   │   ├── buttons/         # Boutons réutilisables
│   │   ├── dashboard/       # Composants du dashboard
│   │   ├── forms/           # Formulaires (auth, monsters)
│   │   ├── inputs/          # Inputs personnalisés
│   │   ├── monsters/        # Composants liés aux monstres
│   │   ├── pwa/             # Composants PWA
│   │   ├── providers/       # Providers React
│   │   └── sections/        # Sections de pages
│   ├── db/                  # Base de données
│   │   ├── index.ts         # Connection manager
│   │   └── models/          # Modèles Mongoose
│   ├── lib/                 # Bibliothèques
│   │   ├── auth.ts          # Configuration Better Auth
│   │   ├── auth-client.ts   # Client Better Auth
│   │   ├── pwa.ts           # Utilitaires PWA
│   │   └── toast.ts         # Helpers toast
│   ├── services/            # Services métier
│   │   └── monster-generator.service.ts
│   └── types/               # Types TypeScript
│       ├── components.ts    # Types composants
│       ├── forms/           # Types formulaires
│       └── monsters/        # Types monstres
├── public/                  # Assets statiques
│   ├── icons/               # Icônes PWA (19 fichiers)
│   ├── manifest.json        # Web App Manifest
│   ├── sw.js                # Service Worker
│   └── browserconfig.xml    # Config Windows
├── docs/                    # Documentation markdown
├── documentation/           # Docusaurus (ce site)
├── scripts/                 # Scripts utilitaires
│   └── generate-icons.js    # Génération icônes PWA
└── specs/                   # Spécifications projet
```

## Commandes Disponibles

```bash
# Développement (avec Turbopack)
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linting
npm run lint

# Générer les icônes PWA
npm install --save-dev sharp
node scripts/generate-icons.js public/logo.png
```

## Prochaines Étapes

Explorez la documentation pour en savoir plus sur :

- [Génération Procédurale](./features/procedural-generation) - Comment les monstres sont créés
- [Notifications Toast](./features/toast-notifications) - Système de notifications
- [PWA](./features/pwa) - Configuration Progressive Web App
- [Architecture](./architecture/overview) - Structure et principes du projet

## Contribution

Les contributions sont les bienvenues ! Consultez le guide de contribution pour plus d'informations.

## Licence

Ce projet est un projet scolaire pour My Digital School.

## Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

---

**Bonne lecture !** 📚✨
