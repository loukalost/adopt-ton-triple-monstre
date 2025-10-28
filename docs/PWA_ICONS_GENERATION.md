# Guide de Génération des Icônes PWA

## Icônes Requises

Pour que la PWA fonctionne correctement, vous devez générer les icônes suivantes dans le dossier `public/icons/` :

### Icônes Standard (Any Purpose)
- `icon-72x72.png` - 72x72px
- `icon-96x96.png` - 96x96px
- `icon-128x128.png` - 128x128px
- `icon-144x144.png` - 144x144px
- `icon-152x152.png` - 152x152px (Apple Touch Icon)
- `icon-180x180.png` - 180x180px (Apple Touch Icon)
- `icon-192x192.png` - 192x192px (**Requis** pour PWA)
- `icon-384x384.png` - 384x384px
- `icon-512x512.png` - 512x512px (**Requis** pour PWA)

### Icônes Maskables (Android Adaptive Icons)
- `icon-maskable-192x192.png` - 192x192px avec safe zone
- `icon-maskable-512x512.png` - 512x512px avec safe zone

### Icônes Windows (Tuiles Microsoft)
- `icon-70x70.png` - 70x70px
- `icon-150x150.png` - 150x150px
- `icon-310x310.png` - 310x310px
- `icon-310x150.png` - 310x150px (Wide tile)

### Icônes de Raccourcis
- `shortcut-create.png` - 96x96px (Action "Créer un monstre")
- `shortcut-monsters.png` - 96x96px (Action "Mes monstres")

### Icône Safari
- `safari-pinned-tab.svg` - Icône vectorielle monochrome

## Méthode 1 : Génération Automatique avec un Outil en Ligne

### PWA Asset Generator (Recommandé)
1. Rendez-vous sur https://www.pwabuilder.com/imageGenerator
2. Uploadez votre logo source (minimum 512x512px, de préférence 1024x1024px)
3. Configurez les options :
   - **Background Color**: `#f7533c` (moccaccino-500)
   - **Padding**: 10-20% pour les icônes standard
   - **Padding Maskable**: 20-40% pour respecter la safe zone
4. Téléchargez le package complet
5. Extrayez dans `public/icons/`

### Favicon Generator
Alternative : https://realfavicongenerator.net/
- Supporte tous les formats (iOS, Android, Windows, Safari)
- Génère automatiquement browserconfig.xml et manifest.json
- Preview en temps réel sur différents appareils

## Méthode 2 : Génération Manuelle avec ImageMagick

Si vous avez ImageMagick installé :

```bash
# Installer ImageMagick (si nécessaire)
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt install imagemagick

# Créer toutes les tailles depuis une image source
magick convert logo-source.png -resize 72x72 public/icons/icon-72x72.png
magick convert logo-source.png -resize 96x96 public/icons/icon-96x96.png
magick convert logo-source.png -resize 128x128 public/icons/icon-128x128.png
magick convert logo-source.png -resize 144x144 public/icons/icon-144x144.png
magick convert logo-source.png -resize 152x152 public/icons/icon-152x152.png
magick convert logo-source.png -resize 180x180 public/icons/icon-180x180.png
magick convert logo-source.png -resize 192x192 public/icons/icon-192x192.png
magick convert logo-source.png -resize 384x384 public/icons/icon-384x384.png
magick convert logo-source.png -resize 512x512 public/icons/icon-512x512.png

# Icônes maskables (avec padding)
magick convert logo-source.png -resize 154x154 -gravity center -extent 192x192 -background "#f7533c" public/icons/icon-maskable-192x192.png
magick convert logo-source.png -resize 410x410 -gravity center -extent 512x512 -background "#f7533c" public/icons/icon-maskable-512x512.png
```

## Méthode 3 : Utilisation de Sharp (Node.js)

Créez un script `scripts/generate-icons.js` :

```javascript
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512]
const inputImage = 'logo-source.png'
const outputDir = 'public/icons'

// Créer le dossier si nécessaire
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Générer les icônes standard
sizes.forEach(size => {
  sharp(inputImage)
    .resize(size, size)
    .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
    .then(() => console.log(`✓ icon-${size}x${size}.png generated`))
    .catch(err => console.error(`✗ Error generating icon-${size}x${size}.png:`, err))
})

// Générer les icônes maskables (avec padding)
[192, 512].forEach(size => {
  const padding = Math.floor(size * 0.2) // 20% padding
  const innerSize = size - (padding * 2)
  
  sharp(inputImage)
    .resize(innerSize, innerSize)
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: '#f7533c'
    })
    .toFile(path.join(outputDir, `icon-maskable-${size}x${size}.png`))
    .then(() => console.log(`✓ icon-maskable-${size}x${size}.png generated`))
    .catch(err => console.error(`✗ Error:`, err))
})
```

Puis exécutez :
```bash
npm install sharp
node scripts/generate-icons.js
```

## Spécifications Importantes

### Icônes Standard (Any Purpose)
- Format : PNG avec transparence
- Dimensions exactes (pas de déformation)
- Couleur de fond : Transparent ou `#f7533c`
- Padding : ~10-20% recommandé

### Icônes Maskables
- **Safe zone** : Contenu important dans un cercle de 80% du diamètre
- Background : Couleur unie `#f7533c` (pas de transparence)
- Centrer le logo avec padding uniforme
- Tester avec [Maskable.app](https://maskable.app/)

### Icône Safari Pinned Tab
- Format : SVG monochrome
- Couleur unique noire (#000000)
- Viewbox : "0 0 16 16" pour un rendu optimal
- Paths optimisés et simplifiés

## Vérification

Après génération, vérifiez :

1. **Lighthouse Audit** (Chrome DevTools)
   - Ouvrir DevTools > Lighthouse
   - Cocher "Progressive Web App"
   - Score PWA doit être ≥ 90

2. **Manifest Validator**
   - https://manifest-validator.appspot.com/
   - Copier le contenu de `manifest.json`

3. **Maskable Icons Test**
   - https://maskable.app/editor
   - Upload `icon-maskable-512x512.png`
   - Vérifier que le contenu reste visible dans toutes les formes

## Source Image Recommandée

Pour de meilleurs résultats, utilisez :
- **Format** : PNG ou SVG
- **Résolution** : Minimum 1024x1024px (2048x2048px idéal)
- **Forme** : Carré, contenu centré
- **Style** : Simple et reconnaissable à petite taille
- **Couleurs** : Palette du projet (moccaccino, lochinvar, fuchsia-blue)

## Fallback Temporaire

En attendant les vraies icônes, vous pouvez utiliser le logo existant :
```bash
# Utiliser logo.png ou logo_comp.webp comme base
magick convert public/logo.png -resize 512x512 public/icons/icon-512x512.png
magick convert public/logo.png -resize 192x192 public/icons/icon-192x192.png
```

## Ressources

- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Maskable.app Editor](https://maskable.app/editor)
- [Adaptive Icon Specs](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)
- [Apple Touch Icon](https://developer.apple.com/design/human-interface-guidelines/app-icons)
