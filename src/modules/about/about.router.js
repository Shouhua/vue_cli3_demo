export default [
  {
    path: '/about',
    component: () => import(/* webpackChunkName: 'about' */ './index.vue')
  }
]
