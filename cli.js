#!/usr/bin/env node
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const amazonFactory = require('./templates/amazon')
const googleFactory = require('./templates/google')

const arg = require('arg')

const args = arg({
  '--help': Boolean,
  '--google': Boolean,
  '--amazon': Boolean,
  '--bins': [String],
  '--name': String,

  '-h': '--help'
}, {
  permissive: true
})

if (args['--help']) {
  console.log('Usage:\n bin2faas [--google | --amazon] --name FUNCTIONNAME BINARYPATHS...')
  process.exit()
}
if (args['--google'] == null || args['--amazon'] == null) {
  console.log('Please specify at least one of [--google | --amazon]')
  process.exit()
}
if (args['--name'] == null || !args['--name'].length) {
  console.log("Please specify '--name'")
  process.exit()
}
if(args._ == null) {
  console.log('Please specify at least one binary path')
  process.exit()
}

// write gcf source
if (args['--google']) {
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

  execSync(`cp ${args._.join(' ')} ${path.join('google/')}`)
}

// write lambda source
if (args['--amazon']) {
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

  execSync(`cp ${args._.join(' ')} ${path.join('amazon/')}`)
}
