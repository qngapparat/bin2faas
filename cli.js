#!/usr/bin/env node
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const amazonFactory = require('./templates/amazon')
const googleFactory = require('./templates/google')

const arg = require('arg')

const args = arg({
  '--help': Boolean,
  '--to': [String],
  '--bins': [String],
  '--name': String,

  '-h': '--help'
})

if (args['--help']) {
  console.log('Usage:\n bin2faas --to PLATFORMS --bins BINARYPATHS')
  process.exit()
}
if (args['--bins'] == null || !args['--bins'].length) {
  console.log("Please specify '--bins'")
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

  const fileContents = googleFactory({
    name: args['--name'],
    functionName: args['--name'],
    runTime: 'nodejs10',
    handler: 'runBins',
    role: 'arn:aws:iam::735406098573:role/lambdaexecute'
  })

  fileContents.forEach(c => {
    fs.writeFile(path.join('google', c.filename), c.content, (err) => {
      if(err) throw err
    })
  })

  execSync(`cp ${args['--bins'].join(' ')} ${path.join('google/')}`)
}

// write lambda source
if (args['--to'].includes('amazon')) {
  // create output dir
  execSync('mkdir amazon')

  // generate lambda source code as strings
  const fileContents = amazonFactory({
    name: args['--name'],
    functionName: args['--name'],
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

  execSync(`cp ${args['--bins'].join(' ')} ${path.join('amazon/')}`)
}
