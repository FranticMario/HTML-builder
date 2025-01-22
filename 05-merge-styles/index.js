const fs = require('fs').promises
const path = require('path')

async function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles')
  const outputFolder = path.join(__dirname, 'project-dist')
  const outputFile = path.join(outputFolder, 'bundle.css')

  await fs.mkdir(outputFolder, { recursive: true })

  const files = await fs.readdir(stylesFolder)
  const cssFiles = files.filter(file => path.extname(file) === '.css')

  console.log(cssFiles)

  let bundle = ''

  for (const file of cssFiles) {
    const filePath = path.join(stylesFolder, file)
    const content = await fs.readFile(filePath, 'utf-8')
    bundle += content + '\n'
  }

  await fs.writeFile(outputFile, bundle)
}

mergeStyles().catch(err => console.error('Error:', err))
