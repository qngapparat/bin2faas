
function generate (config) {
  const obj = {
    name: config.name,
    main: 'index.js',
    scripts: {
      test: "echo 'Error: no test specified' && exit 1",
      deploy: `gcloud functions deploy ${config.functionName} --runtime ${config.runTime} --entry-point ${config.handler} --trigger-http`
      // TODO handle permissions(not)needed not set, followup with gcloud alpha role...
    }
  }

  return {
    filename: 'package.json',
    content: JSON.stringify(obj, null, 2)
  }
}

module.exports = generate
