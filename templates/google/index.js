const indexFactory = require('./index.factory')
const packageFactory = require('./package.factory')

/**
 * @returns {[{ filename: string, content: string }]} Array of generated FaaS files. Each object in the array contains 'filename', and the file 'content' as string
 */
function build (config) {
  const i = indexFactory(config)
  const p = packageFactory(config)

  return [
    { filename: i.filename, content: i.content },
    { filename: p.filename, content: p.content }
  ]
}

module.exports = build
