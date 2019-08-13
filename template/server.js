const Koa = require('koa')
const path = require('path')
const fs = require('fs')
const serve = require('koa-static')
const { createBundleRenderer } = require('vue-server-renderer')

const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')

const renderer = createBundleRenderer(serverBundle, {
  basedir: path.resolve(__dirname, '/dist/'),
  runInNewContext: false,
  clientManifest,
  template: fs.readFileSync('./index.template.html', 'utf-8')
})

const app = new Koa()

app.use(serve('dist', { index: 'xxx.html' }))

app.use(async ctx => {
  const context = {
    title: 'Vue SSR',
    url: ctx.req.url
  }

  console.log('ctx.path', ctx.path)
  try {
    const html = await renderer.renderToString(context)
    ctx.body = html
  } catch (err) {
    console.error(err)
  }
})

// app.use(ctx => {
//   const context = {
//     title: 'Vue SSR',
//     url: ctx.req.url
//   }
//   console.log('ctx.req.url', ctx.req.url)
//   return renderer
//     .renderToString(context)
//     .then(html => {
//       ctx.body = html
//     })
//     .catch(console.error)
// })

app.listen(4000, () => {
  console.log('应用程序开始运行于 3000 端口')
})
