import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// Home route
const HomeRoute: RouteObject = {
  path: '/home',
  name: 'Home',
  element: <LayoutGuard />,
  meta: {
    title: '积分墙数据汇总',
    icon: 'home',
    affix: true,
    orderNo: 1,
    hideChildrenInMenu: true
  },
  children: [
    {
      path: '',
      name: 'HomePage',
      element: LazyLoad(lazy(() => import('@/views/home'))),
      meta: {
        title: '积分墙数据汇总',
        key: 'home',
        icon: 'home',
        orderNo: 1,
        hideMenu: true
      }
    }
  ]
}

export default HomeRoute
