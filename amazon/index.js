
  const { execSync } = require('child_process')

  function runBins (event, context, callback) {
    if (event.commands == null) {
      throw new Error("Specify the 'commands' field if you want your binaries to do anything ;)")
    }

    if (!event.commands.length) throw new Error("Field 'commands' must be array")

    event.commands.forEach(cmd => {
      try {
        // eslint-disable-next-line no-undef
        const stdout = execSync(cmd, event.options || undefined)
        console.log(stdout.toString())
      } catch (e) {
        console.error(`Shell command '${cmd}' failed.`)
        throw e
      }
    })
  }

  exports.runBins = runBins;
  