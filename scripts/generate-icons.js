// Script de génération automatique des icônes PWA
// Utilise Sharp pour générer toutes les tailles d'icônes à partir d'une image source
//
// Usage: node scripts/generate-icons.js [input-image]
// Exemple: node scripts/generate-icons.js public/logo.png

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// Configuration
const INPUT_IMAGE = process.argv[2] || 'public/logo.png'
const OUTPUT_DIR = 'public/icons'

// Tailles d'icônes requises
const ICON_SIZES = [
  { size: 72, name: 'icon-72x72.png', purpose: 'any' },
  { size: 96, name: 'icon-96x96.png', purpose: 'any' },
  { size: 128, name: 'icon-128x128.png', purpose: 'any' },
  { size: 144, name: 'icon-144x144.png', purpose: 'any' },
  { size: 152, name: 'icon-152x152.png', purpose: 'any' },
  { size: 180, name: 'icon-180x180.png', purpose: 'any' },
  { size: 192, name: 'icon-192x192.png', purpose: 'any' },
  { size: 384, name: 'icon-384x384.png', purpose: 'any' },
  { size: 512, name: 'icon-512x512.png', purpose: 'any' }
]

// Tailles pour icônes maskables (avec padding)
const MASKABLE_SIZES = [
  { size: 192, name: 'icon-maskable-192x192.png', padding: 0.2 },
  { size: 512, name: 'icon-maskable-512x512.png', padding: 0.2 }
]

// Tailles pour tuiles Windows
const WINDOWS_SIZES = [
  { width: 70, height: 70, name: 'icon-70x70.png' },
  { width: 150, height: 150, name: 'icon-150x150.png' },
  { width: 310, height: 310, name: 'icon-310x310.png' },
  { width: 310, height: 150, name: 'icon-310x150.png' }
]

// Tailles pour raccourcis
const SHORTCUT_SIZES = [
  { size: 96, name: 'shortcut-create.png' },
  { size: 96, name: 'shortcut-monsters.png' }
]

// Couleur de fond pour maskables et Windows
const BACKGROUND_COLOR = '#f7533c' // moccaccino-500

// Créer le dossier de sortie si nécessaire
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  console.log(`✓ Created directory: ${OUTPUT_DIR}`)
}

// Vérifier que l'image source existe
if (!fs.existsSync(INPUT_IMAGE)) {
  console.error(`✗ Error: Input image not found: ${INPUT_IMAGE}`)
  console.log('\nUsage: node scripts/generate-icons.js [input-image]')
  console.log('Example: node scripts/generate-icons.js public/logo.png')
  process.exit(1)
}

console.log(`\n🎨 Generating PWA icons from: ${INPUT_IMAGE}\n`)

// Fonction pour générer les icônes standard
async function generateStandardIcons () {
  console.log('📦 Generating standard icons...')

  for (const { size, name } of ICON_SIZES) {
    try {
      await sharp(INPUT_IMAGE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(path.join(OUTPUT_DIR, name))

      console.log(`  ✓ ${name} (${size}x${size})`)
    } catch (error) {
      console.error(`  ✗ Error generating ${name}:`, error.message)
    }
  }
}

// Fonction pour générer les icônes maskables
async function generateMaskableIcons () {
  console.log('\n🎭 Generating maskable icons...')

  for (const { size, name, padding } of MASKABLE_SIZES) {
    try {
      const paddingPx = Math.floor(size * padding)
      const innerSize = size - paddingPx * 2

      await sharp(INPUT_IMAGE)
        .resize(innerSize, innerSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .extend({
          top: paddingPx,
          bottom: paddingPx,
          left: paddingPx,
          right: paddingPx,
          background: BACKGROUND_COLOR
        })
        .png()
        .toFile(path.join(OUTPUT_DIR, name))

      console.log(`  ✓ ${name} (${size}x${size} with ${padding * 100}% padding)`)
    } catch (error) {
      console.error(`  ✗ Error generating ${name}:`, error.message)
    }
  }
}

// Fonction pour générer les tuiles Windows
async function generateWindowsTiles () {
  console.log('\n🪟 Generating Windows tiles...')

  for (const { width, height, name } of WINDOWS_SIZES) {
    try {
      const size = Math.min(width, height)

      await sharp(INPUT_IMAGE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .extend({
          top: Math.floor((height - size) / 2),
          bottom: Math.ceil((height - size) / 2),
          left: Math.floor((width - size) / 2),
          right: Math.ceil((width - size) / 2),
          background: BACKGROUND_COLOR
        })
        .png()
        .toFile(path.join(OUTPUT_DIR, name))

      console.log(`  ✓ ${name} (${width}x${height})`)
    } catch (error) {
      console.error(`  ✗ Error generating ${name}:`, error.message)
    }
  }
}

// Fonction pour générer les icônes de raccourcis
async function generateShortcutIcons () {
  console.log('\n⚡ Generating shortcut icons...')

  for (const { size, name } of SHORTCUT_SIZES) {
    try {
      // Pour les raccourcis, on utilise la même image source
      // Dans un vrai projet, vous pourriez avoir des images spécifiques
      await sharp(INPUT_IMAGE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(path.join(OUTPUT_DIR, name))

      console.log(`  ✓ ${name} (${size}x${size})`)
    } catch (error) {
      console.error(`  ✗ Error generating ${name}:`, error.message)
    }
  }
}

// Fonction pour générer l'icône Safari (SVG)
async function generateSafariIcon () {
  console.log('\n🍎 Generating Safari pinned tab icon...')

  try {
    // Sharp ne peut pas créer de SVG directement
    // On génère un PNG noir et blanc qu'il faudra convertir manuellement
    const tempFile = path.join(OUTPUT_DIR, 'safari-pinned-tab-temp.png')

    await sharp(INPUT_IMAGE)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .greyscale()
      .threshold(128)
      .png()
      .toFile(tempFile)

    console.log('  ⚠ safari-pinned-tab-temp.png generated (convert to SVG manually)')
    console.log('    Use: https://www.aconvert.com/image/png-to-svg/')
  } catch (error) {
    console.error('  ✗ Error generating Safari icon:', error.message)
  }
}

// Fonction principale
async function main () {
  try {
    await generateStandardIcons()
    await generateMaskableIcons()
    await generateWindowsTiles()
    await generateShortcutIcons()
    await generateSafariIcon()

    console.log('\n✅ Icon generation complete!\n')
    console.log('📋 Next steps:')
    console.log('  1. Convert safari-pinned-tab-temp.png to SVG manually')
    console.log('  2. Test maskable icons at https://maskable.app/')
    console.log('  3. Validate manifest at https://manifest-validator.appspot.com/')
    console.log('  4. Run Lighthouse audit for PWA score\n')
  } catch (error) {
    console.error('\n✗ Error during icon generation:', error)
    process.exit(1)
  }
}

// Exécuter
main()
