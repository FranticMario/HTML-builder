const fs = require('fs/promises')
const path = require('path')

const newPath = path.join(__dirname, 'secret-folder')

const readFilesInFolder = async () => {
  try {
    const results = []
    const files = await fs.readdir(newPath, { withFileTypes: true })

    for (const file of files) {
      if (!file.isFile()) continue

      const statFile = await fs.stat(path.join(newPath, file.name))
      results.push(`${file.name} - ${(statFile.size / 1024).toFixed(2)} kB`)
    }

    return results
  } catch (err) {
    throw err
  }
}

readFilesInFolder()
  .then(array => console.log(array.join('\n')))
  .catch(err => console.error(err))
