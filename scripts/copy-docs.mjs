import { cp, rm } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve } from 'path'

const src = resolve(process.cwd(), 'documentation', 'build')
const dest = resolve(process.cwd(), 'public', 'documentation')

async function main () {
  if (!existsSync(src)) {
    console.error(`Source docs build not found: ${src}`)
    console.error('Run "cd documentation && npm run build" first')
    process.exit(1)
  }

  // Remove existing destination if present
  try {
    await rm(dest, { recursive: true, force: true })
    console.log('Removed existing documentation folder')
  } catch (e) {
    // ignore
  }

  // Copy recursively (Node 16+)
  try {
    await cp(src, dest, { recursive: true })
    console.log(`✅ Documentation copied from ${src} to ${dest}`)
  } catch (err) {
    console.error('❌ Failed to copy documentation:', err)
    process.exit(2)
  }
}

main()
