const { Service, executeScriptAsync } = require('clean-scripts')
const { watch } = require('watch-then-execute')

const tsFiles = `"src/**/*.ts" "spec/**/*.ts"`
const jsFiles = `"*.config.js" "spec/**/*.config.js"`
const lessFiles = `"*.less"`

const isDev = process.env.NODE_ENV === 'development'

const templateCommand = 'file2variable-cli --config file2variable.config.js'
const tscCommand = 'tsc'
const webpackCommand = 'webpack'
const revStaticCommand = 'rev-static'
const cssCommand = [
  'lessc index.less > index.css',
  'postcss index.css -o index.postcss.css',
  'cleancss -o index.bundle.css index.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css'
]
const swCommand = isDev ? undefined : [
  'sw-precache --config sw-precache.config.js --verbose',
  'uglifyjs service-worker.js -o service-worker.bundle.js'
]

module.exports = {
  build: [
    {
      js: [
        templateCommand,
        tscCommand,
        webpackCommand
      ],
      css: cssCommand,
      clean: 'rimraf **/*.bundle-*.js *.bundle-*.css'
    },
    revStaticCommand,
    swCommand
  ],
  lint: {
    ts: `eslint --ext .js,.ts ${tsFiles} ${jsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export ${tsFiles} ${lessFiles} --strict --need-module tslib`,
    commit: `commitlint --from=HEAD~1`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p . --ignore-files src/variables.ts --ignore-catch'
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js'
  ],
  fix: {
    ts: `eslint --ext .js,.ts ${tsFiles} ${jsFiles} --fix`,
    less: `stylelint --fix ${lessFiles}`
  },
  watch: {
    template: `${templateCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    less: () => watch(['*.less'], [], () => executeScriptAsync(cssCommand)),
    rev: `${revStaticCommand} --watch`
  },
  screenshot: [
    new Service('http-server -p 8000'),
    'tsc -p screenshots',
    'node screenshots/index.js'
  ],
  prerender: [
    new Service('http-server -p 8000'),
    'tsc -p prerender',
    'node prerender/index.js',
    revStaticCommand,
    swCommand
  ]
}
