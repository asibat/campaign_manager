const Koa = require('koa')
const koaBody = require('koa-body')
const mongoose = require('mongoose')
const { merge } = require('lodash')

const config = require('./config/config')
const defaultConfig = config.development
const environment = process.env.NODE_ENV || 'development'
const environmentConfig = config[environment]
const finalConfig = merge(defaultConfig, environmentConfig)

const router = require('./routes')

const app = new Koa()
const db = mongoose.connection

mongoose.connect(finalConfig.mongoUrl)

db.on('error', error => {
  console.error('Database connection error!')
  throw error
})
db.once('connected', () => console.log('Connected to database'))

app.use(koaBody({ multipart: true }))

// A universal interceptor that prints the ctx each time a request is made on the server
if (process.env.NODE_ENV !== 'production') {
  app.use(async (ctx, next) => {
    console.log(ctx)
    await next()
  })
}

// Error handling
app.use(async function(ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.app.emit('error', err, ctx)
  }
})

// Load the router into the Koa app
app.use(router.routes())
app.use(router.allowedMethods())

// Start server
const port = finalConfig.app.port || 8080
module.exports = app.listen(port, function() {
  console.log('Server listening on', port)
})
