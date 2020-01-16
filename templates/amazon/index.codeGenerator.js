
// todo determine faas platform
// aws

/**
 * This function generates the function source that will call the binaries
 * @param {config} config Configuration for the function gen
 * @returns {string} The generated source code for index.js
 */
function generate (config) {
  // !!!! This is not CLI source code
  // This is GENERATED lambda/gcloud source code, before it's stringified
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

  // return the source code above as string
  const fullSource = `
  const { execSync } = require('child_process')

  ${runBins.toString()}

  exports.runBins = runBins;
  `

  return {
    filename: 'index.js',
    content: fullSource
  }
}

module.exports = generate

// TODO in tempaltes code that'll run on FaaS, THROW on false/probably faulty args - not just exit()
