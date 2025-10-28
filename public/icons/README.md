# PWA Icons Directory

This directory contains all the icons required for the Progressive Web App (PWA) functionality.

## Required Icons

The following icons must be present for full PWA support:

### Standard Icons (Any Purpose)
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-180x180.png`
- `icon-192x192.png` ⭐ **Required for PWA**
- `icon-384x384.png`
- `icon-512x512.png` ⭐ **Required for PWA**

### Maskable Icons (Android Adaptive)
- `icon-maskable-192x192.png`
- `icon-maskable-512x512.png`

### Windows Tiles
- `icon-70x70.png`
- `icon-150x150.png`
- `icon-310x310.png`
- `icon-310x150.png`

### Shortcuts
- `shortcut-create.png`
- `shortcut-monsters.png`

### Safari
- `safari-pinned-tab.svg`

## Generating Icons

To generate all icons from a source image:

```bash
# Install Sharp (if not already installed)
npm install --save-dev sharp

# Run the generation script
node scripts/generate-icons.js public/logo.png
```

See `docs/PWA_ICONS_GENERATION.md` for detailed instructions.

## Icon Specifications

- **Format**: PNG with transparency (except maskable icons)
- **Background**: Transparent or `#f7533c` (moccaccino-500)
- **Maskable Padding**: 20% safe zone for adaptive icons
- **Quality**: High resolution, optimized for web

## Testing

- **Maskable Icons**: https://maskable.app/
- **Manifest Validation**: https://manifest-validator.appspot.com/
- **Lighthouse PWA Audit**: Chrome DevTools > Lighthouse
