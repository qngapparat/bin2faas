#!/usr/bin/env node
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const amazonFactory = require('./templates/amazon')

const arg = require('arg')

const args = arg({
  '--help': Boolean,
  '--to': [String],
  '--dir': [String],
  '--name': String,

  '-h': '--help'
})

if (args['--help']) {
  console.log('Usage:\n bin2faas --to PLATFORMS --dir BINARYPATHS')
  process.exit()
}
if (args['--dir'] == null || !args['--dir'].length) {
  console.log("Please specify '--dir'")
  process.exit()
}
if (args['--to'] == null || !args['--to'].length) {
  console.log("Please specify '--to'")
  process.exit()
}
if (args['--name'] == null || !args['--name'].length) {
  console.log("Please specify '--name'")
  process.exit()
}

// write gcf source
if (args['--to'].includes('google')) {
  execSync('mkdir google')
}

// write lambda source
if (args['--to'].includes('amazon')) {
  // create output dir
  execSync('mkdir amazon')

  // generate lambda source code as strings
  const fileContents = amazonFactory({
    name: args['--name'],
    functionName: 'second',
    runTime: 'nodejs10.x',
    handler: 'index.runBins',
    role: 'arn:aws:iam::735406098573:role/lambdaexecute'
  })

  console.log(fileContents)

  fileContents.forEach(c => {
    fs.writeFile(path.join('amazon', c.filename), c.content, (err) => {
      if (err) throw err
    })
  })

  execSync(`cp ${args['--dir'].join(' ')} ${path.join('amazon/')}`)
}
