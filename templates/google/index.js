const iGen = require('./index.codeGenerator')
const pGen = require('./package.codeGenerator')

/**
 * @returns {[{ filename: string, content: string }]} Array of generated FaaS files. Each object in the array contains 'filename', and the file 'content' as string
 */
function generate (config) {
  const i = iGen(config)
  const p = pGen(config)

  return [
    { filename: i.filename, content: i.content },
    { filename: p.filename, content: p.content }
  ]
}

module.exports = generate
