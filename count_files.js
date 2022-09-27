const fs = require("fs")

filesCount = {}

// read recursively the files and count its file lines
function readFileLinesCount(rootFile) {
  let total = 0
  try {
    const files = fs.readdirSync(rootFile)
    const filesStr = []
    for (const file of files) {
      filesStr.push(file)
    }

    filesStr.forEach(fileName => {
      if (fileName.endsWith(".js")) {
        const data = fs.readFileSync(rootFile + "/" + fileName, 'UTF-8')
        const lines = data.split(/\r?\n/)
        total = total + lines.length
        filesCount[rootFile + "/" + fileName] = lines.length
      } else {
        if (fs.lstatSync(rootFile + "/" + fileName).isDirectory() && fileName != '.git') {
          const totalByFolder = readFileLinesCount(rootFile + "/" + fileName)
          total = total + totalByFolder
          filesCount[rootFile + "/" + fileName] = totalByFolder
        }
      }
    })
  } catch (err) {
    console.log(err)
  }
  return total
}

const rootTotal =  readFileLinesCount(".")

console.log(filesCount)

fs.appendFileSync('total.md', "\n" + rootTotal)
fs.writeFileSync('Readme.md', Object.keys(filesCount).map(k => k + "(" + filesCount[k] + ")").join("\n"))
