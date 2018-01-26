const fs = require('fs')
const { rollup } = require('rollup')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-js')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const packages = require('./package')

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

const build = async (opts) => {
  const plugins = [
    babel({
      babelrc: false,
      presets: [
        ['es2015-rollup'],
        'stage-0'
      ],
      plugins: ['transform-object-assign']
    }),
    replace({
      '__version__': packages.version
    })
  ]
  if (opts.env === 'production') {
    plugins.push(uglify({
      compress: {
        drop_debugger: true,
        drop_console: true
      }
    }, minify))
    plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }
  const bundle = await rollup({ input: opts.input, plugins })
  await bundle.write({
    name: opts.name,
    format: opts.format,
    file: `dist/${opts.destName}`,
    sourcemap: true
  })
}

const builds = [
  {
    name: 'VueWatchComponent',
    destName: 'vue-watch-component.js',
    input: 'src/index.js',
    format: 'umd',
    env: 'development'
  },
  {
    name: 'VueWatchComponent',
    destName: 'vue-watch-component.min.js',
    input: 'src/index.js',
    format: 'umd',
    env: 'production'
  },
  {
    destName: 'vue-watch-component.common.js',
    input: 'src/index.js',
    format: 'cjs'
  },
  {
    destName: 'vue-watch-component.esm.js',
    input: 'src/index.js',
    format: 'es'
  }
]

builds.forEach(opts => build(opts))
