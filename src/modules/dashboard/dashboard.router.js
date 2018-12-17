export default [
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: 'dashboard' */ './index.vue')
  }
]
