import Vue from 'vue'
import Router from 'vue-router'

const Bar = () => import('./components/Bar.vue')
const Foo = () => import('./components/Foo.vue')
const Baz = () => import('./components/Baz.vue')

Vue.use(Router)

export default function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        // component: Baz
        redirect: 'baz'
      },
      {
        path: '/baz',
        component: Baz
      },
      {
        path: '/foo',
        component: Foo
      },
      {
        path: '/bar',
        component: Bar
      }
    ]
  })
}
