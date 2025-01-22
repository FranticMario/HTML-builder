const fs = require('fs').promises
const path = require('path')

const distFolder = path.join(__dirname, 'project-dist')
const templatePath = path.join(__dirname, 'template.html')
const componentsPath = path.join(__dirname, 'components')
const stylesFolder = path.join(__dirname, 'styles')
const assetsFolder = path.join(__dirname, 'assets')
const distHTML = path.join(distFolder, 'index.html')
const distCSS = path.join(distFolder, 'style.css')

async function buildHTML() {
  const templateContent = await fs.readFile(templatePath, 'utf-8')
  const componentFiles = await fs.readdir(componentsPath)
  const replacements = await Promise.all(
    componentFiles.map(async file => {
      if (path.extname(file) === '.html') {
        const componentName = path.parse(file).name
        const componentContent = await fs.readFile(path.join(componentsPath, file), 'utf-8')
        return { tag: `{{${componentName}}}`, content: componentContent }
      }
      return null
    }),
  )

  const updatedTemplate = replacements.reduce((result, replacement) => {
    if (replacement) {
      const { tag, content } = replacement
      return result.replace(new RegExp(tag, 'g'), content)
    }
    return result
  }, templateContent)

  await fs.writeFile(distHTML, updatedTemplate)
}

async function buildCSS() {
  const files = await fs.readdir(stylesFolder)
  const cssFiles = files.filter(file => path.extname(file) === '.css')

  const stylesContent = (
    await Promise.all(cssFiles.map(file => fs.readFile(path.join(stylesFolder, file), 'utf-8')))
  ).join('\n')

  await fs.writeFile(distCSS, stylesContent)
}

async function copyAssets() {
  async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true })
    const entries = await fs.readdir(src, { withFileTypes: true })

    await Promise.all(
      entries.map(entry => {
        const srcPath = path.join(src, entry.name)
        const destPath = path.join(dest, entry.name)

        return entry.isDirectory() ? copyDir(srcPath, destPath) : fs.copyFile(srcPath, destPath)
      }),
    )
  }

  await copyDir(assetsFolder, path.join(distFolder, 'assets'))
}

async function buildPage() {
  try {
    await fs.mkdir(distFolder, { recursive: true })
    await Promise.all([buildHTML(), buildCSS(), copyAssets()])
    console.log('Build completed successfully!')
  } catch (err) {
    console.error('Error during build:', err)
  }
}

buildPage()
