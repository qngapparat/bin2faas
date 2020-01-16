const meow = require('meow')

function getCliArgs () {
  const help = `
    Usage
      $ bin2faas OPTIONS... BINARYPATHS...
  
    Options
      --name <FUNCTIONNAME>  
      --google  Build for Google
      --amazon  Build for Amazon
  `

  // TODO add emojis in CLI 📦

  const { input, flags } = meow(
    help,
    {
      flags: {
        google: {
          type: 'boolean'
        },
        amazon: {
          type: 'boolean'
        },
        name: {
          type: 'string'
        },
        help: {
          type: 'boolean',
          alias: 'h'
        }
      }
    }
  )

  return { input, flags }
}

function validateCliArgs (input, flags) {
  if(!flags.google && !flags.amazon) {
    console.log('Specify at least one of [ --google | --amazon ]')
    process.exit()
  }

  if(!input.length) {
    console.log('Specify one or more binary files you want to include')
    process.exit()
  }

  if(flags.amazon && !flags.role) {
    console.log('You specified --amazon. Please add --role <LAMBDA-EXEC-ROLE-ARN>')
    process.exit()
  }
}

module.exports = {
  getCliArgs,
  validateCliArgs
}
