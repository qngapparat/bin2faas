#!/usr/bin/env node
const { getCliArgs, validateCliArgs } = require('./cli-utils')
const { execSync } = require('child_process')
const amazonCodeGen = require('./templates/amazon')
const googleCodeGen = require('./templates/google')
const fs = require('fs')
const path = require('path')

function buildAmazonFolder (input, flags) {
  execSync('mkdir amazon')

  const fileContentsArray = amazonCodeGen({
    name: flags.name,
    functionName: flags.name,
    runTime: 'nodejs10.x',
    handler: 'index.runBins',
    role: flags.role // || 'arn:aws:iam::735406098573:role/lambdaexecute' // may be null
  })

  fileContentsArray.forEach(fc => {
    fs.writeFile(path.join('amazon', fc.filename), fc.content, (err) => {
      if(err) throw err
    })
  })

  execSync(`cp ${input.join(' ')} 'amazon/'`)
}

function buildGoogleFolder (input, flags) {
  execSync('mkdir google')

  // generate FaaS source code
  const fileContentsArray = googleCodeGen({
    name: flags.name,
    functionName: flags.name,
    runTime: 'nodejs10',
    handler: 'runBins'
  })

  // write FaaS source code to google/*
  fileContentsArray.forEach(fc => {
    fs.writeFile(path.join('google', fc.filename), fc.content, (err) => {
      if(err) throw err
    })
  })

  // copy user-specified binaries into google/
  execSync(`cp ${input.join(' ')} google/`)
}

function main () {
  const { input, flags } = getCliArgs()
  validateCliArgs(input, flags)

  // creates the /google folder
  if (flags.google) {
    buildGoogleFolder(input, flags)
  }

  // // creates the /amazon folder
  if (flags.amazon) {
    buildAmazonFolder(input, flags)
  }
}

main()
