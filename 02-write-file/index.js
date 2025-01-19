const fs = require('fs')
const path = require('path')
const readline = require('readline')

const filePath = path.join(__dirname, 'output.txt')

const writeStream = fs.createWriteStream(filePath, { flags: 'a' })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log("Введите текст для записи в файл (или 'exit' для выхода):")

rl.on('line', input => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Спасибо за использование программы! До свидания!')
    rl.close()
  } else {
    writeStream.write(input + '\n')
    console.log("Текст записан! Введите следующий текст или 'exit' для выхода:")
  }
})

rl.on('SIGINT', () => {
  console.log('\nЗавершение программы. До свидания!')
  rl.close()
})

rl.on('close', () => {
  writeStream.end()
})
