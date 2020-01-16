# bin2faas

Turn binaries into FaaS functions

## Install globally
```shell
npm i bin2faas -g
```

## Usage
```
$ bin2faas OPTIONS... BINARYPATHS...
  
  Options
    --name <FUNCTIONNAME>  
    --google  Build for Google
    --amazon  Build for Amazon
```

## Example

### Create

```shell
bin2faas --name myFirstFunc --amazon --google ./helloworld.out
```

### Deploy

```shell
cd amazon
npm run deploy

# or

cd google
npm run deploy
```

### Call

When invoking your function, specify the 'commands' field in the payload:

```
...
commands: [ 'ls -la', './helloworld.out' ],
...
```

These commands will be executed in sequence.

### Output

STDOUT and STDERR will be logged by the FaaS Platform (AWS Logs, GC Logs)

## License

MIT