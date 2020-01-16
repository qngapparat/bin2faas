
/**
 * (DOES NOT SANITYCHECK CONFIG) This function builds the package.json file to be uploaded along with index.js
 * @param {config} config Configuration for the function builder
 * @returns {string} The generated source code for package.json
 */
function generate (config) {
  const obj = {
    name: config.name,
    main: 'index.js',
    scripts: {
      test: "echo 'Error: no test specified' && exit 1",
      create: `zip -r deploypackage.zip * ; \
        aws lambda create-function \
         --function-name ${config.functionName} \
         --runtime ${config.runTime} \
         --handler ${config.handler} \
         --role ${config.role} \
         --zip-file fileb://deploypackage.zip; \
         rm deploypackage.zip
         `,
      update: `zip -r deploypackage.zip * ; \
        aws lambda update-function-code \
         --function-name ${config.functionName} \
         --zip-file fileb://deploypackage.zip; \
         rm deploypackage.zip`
      // // TODO require max run time (3 sec default is always shitty)
      // createAmazon: 'zip -r deploypackage.zip * ; aws lambda create-function' +
      //   (config.functionName && ` --function-name ${config.functionName}` || '') +
      //   (config.runTime && ` --runtime ${config.runTime}` || '') +
      //   (config.role && ` --role ${config.role}` || '') +
      //   (config.handler && ` --handler ${config.handler}` || '') +
      //   ' --zip-file fileb://deploypackage.zip',
      // updateAmazon: `zip -r deploypackage.zip * ; aws lambda update-function-code --function-name ${config.functionName} --zip-file fileb://deploypackage.zip; rm deploypackage.zip`,

      // createGoogle: "echo 'TODO'"
    }
  }

  return {
    filename: 'package.json',
    content: JSON.stringify(obj, null, 2)
  }
}

module.exports = generate
