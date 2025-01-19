const fs = require('fs')
const path = require('path')
const fsPromises = require('fs/promises')
const readline = require('readline')

const templateFilePath = path.join(__dirname, 'template.html')
const componentsDir = path.join(__dirname, 'components')
const stylesDir = path.join(__dirname, 'styles')
const assetsDir = path.join(__dirname, 'assets')
const outputDir = path.join(__dirname, 'project-dist')
const outputFilePath = path.join(outputDir, 'index.html')
const styleFilePath = path.join(outputDir, 'style.css')
const outputAssetsDir = path.join(outputDir, 'assets')

async function buildPage() {
  try {
    if (!fs.existsSync(outputDir)) {
      await fsPromises.mkdir(outputDir, { recursive: true })
    }

    await buildIndexHtml()
    await mergeStyles()
    await copyAssets()

    console.log('Page built successfully!')
  } catch (err) {
    console.error('Error building the page:', err)
  }
}

async function buildIndexHtml() {
  const templateContent = await fsPromises.readFile(templateFilePath, 'utf-8')
  const componentFiles = await fsPromises.readdir(componentsDir)
  let indexHtml = templateContent

  for (const file of componentFiles) {
    if (path.extname(file) === '.html') {
      const componentName = path.parse(file).name
      const componentContent = await fsPromises.readFile(path.join(componentsDir, file), 'utf-8')
      const regex = new RegExp(`{{${componentName}}}`, 'g')
      indexHtml = indexHtml.replace(regex, componentContent)
    }
  }

  await fsPromises.writeFile(outputFilePath, indexHtml)
}

async function mergeStyles() {
  const files = await fsPromises.readdir(stylesDir)
  let allStyles = ''

  for (const file of files) {
    if (path.extname(file) === '.css') {
      const cssContent = await fsPromises.readFile(path.join(stylesDir, file), 'utf-8')
      allStyles += cssContent + '\n'
    }
  }

  await fsPromises.writeFile(styleFilePath, allStyles)
}

async function copyAssets() {
  const files = await fsPromises.readdir(assetsDir)

  for (const file of files) {
    const sourcePath = path.join(assetsDir, file)
    const destPath = path.join(outputAssetsDir, file)

    if (fs.statSync(sourcePath).isDirectory()) {
      await fsPromises.mkdir(destPath, { recursive: true })
      await copyDirRecursively(sourcePath, destPath)
    } else {
      await fsPromises.copyFile(sourcePath, destPath)
    }
  }
}

async function copyDirRecursively(sourceDir, destDir) {
  const files = await fsPromises.readdir(sourceDir)

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file)
    const destPath = path.join(destDir, file)

    if (fs.statSync(sourcePath).isDirectory()) {
      await fsPromises.mkdir(destPath, { recursive: true })
      await copyDirRecursively(sourcePath, destPath)
    } else {
      await fsPromises.copyFile(sourcePath, destPath)
    }
  }
}

buildPage()
