var fs = require('fs')
var path = require('path')
var yargs = require('yargs')
var tryRequire = require('try-require')

module.exports = function(options) {
  options = options || {};
  var argv = options.argv || process.argv
  var env = options.env || process.env
  var cwd = options.cwd || process.cwd()

  var args = yargs(argv)
    .describe('runner', 'which runner to use (for example, nibbler-ssh-runner or just ssh)')
    .alias('runner', 'r')
    .default('runner', 'nibbler-runner-local')
    .argv

  var config = {
    runner: args.runner || process.env.RUNNER
  }

  var context = {
    argv: argv,
    args: args,
    env: env,
    config: config
  }

  var Runner = tryRequire(path.join(cwd, 'node_modules', config.runner)) ||
               tryRequire(path.join(cwd, 'node_modules', 'nibbler-runner-' + config.runner)) ||
               tryRequire(config.runner) ||
               tryRequire('nibbler-runner-' + config.runner)

  if (!Runner) throw new Error('No such runner: ' + config.runner)

  var runner = new Runner(context)
  context.runner = runner

  return context
}
