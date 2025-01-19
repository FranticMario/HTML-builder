const fs = require('fs')
const path = require('path')

async function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles')
  const outputDir = path.join(__dirname, 'project-dist')
  const outputFile = path.join(outputDir, 'bundle.css')

  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const files = fs.readdirSync(stylesDir)
    let allStyles = ''

    for (const file of files) {
      const filePath = path.join(stylesDir, file)

      if (fs.statSync(filePath).isFile() && path.extname(file) === '.css') {
        const cssContent = fs.readFileSync(filePath, 'utf-8')
        allStyles += cssContent + '\n'
      }
    }

    fs.writeFileSync(outputFile, allStyles)
    console.log('Styles have been merged into bundle.css')
  } catch (err) {
    console.error('Error merging styles:', err)
  }
}

mergeStyles()
