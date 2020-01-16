
// todo determine faas platform

function generate (config) {
  // start FaaS source code
  function runBins (req, res) {
    const commands = req.query.commands || req.body.commands
    const options = req.query.options || req.body.options

    if (commands == null) {
      throw new Error("Specify the 'commands' field if you want your binaries to do anything ;)")
    }

    if (!commands.length) throw new Error("Field 'commands' must be array")

    commands.forEach(cmd => {
      try {
        // eslint-disable-next-line no-undef
        const stdout = execSync(cmd, options || undefined)
        console.log(stdout.toString())
      } catch (e) {
        console.error(`Shell command '${cmd}' failed.`)
        throw e
      }
    })

    res.sendStatus(200)
  }
  // end FaaS source code

  // return the source code above as string
  const fullSource = `
  const { execSync } = require('child_process')

  ${runBins.toString()}

  exports.runBins = runBins; // TODO replace with user-given fn name
  `

  return {
    filename: 'index.js',
    content: fullSource
  }
}

module.exports = generate
