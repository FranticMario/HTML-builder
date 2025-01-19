const fs = require('fs')
const path = require('path')
const fsPromises = require('fs/promises')

async function copyDirectory(sourceDir, destDir) {
  try {
    await fsPromises.mkdir(destDir, { recursive: true })

    const entries = await fsPromises.readdir(sourceDir, { withFileTypes: true })
    const destEntries = await fsPromises.readdir(destDir)

    for (const file of destEntries) {
      const destFilePath = path.join(destDir, file)
      const sourceFilePath = path.join(sourceDir, file)

      if (!entries.some(entry => entry.name === file)) {
        await fsPromises.rm(destFilePath, { recursive: true, force: true })
      }
    }

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name)
      const destPath = path.join(destDir, entry.name)

      if (entry.isDirectory()) {
        await copyDirectory(sourcePath, destPath)
      } else {
        await fsPromises.copyFile(sourcePath, destPath)
      }
    }
  } catch (err) {
    console.error(`Error copying directory: ${err.message}`)
  }
}

async function main() {
  const sourceDir = path.join(__dirname, 'files')
  const destDir = path.join(__dirname, 'files-copy')

  console.log('Starting directory copy...')

  await copyDirectory(sourceDir, destDir)

  console.log('Directory copy complete!')
}

main()
