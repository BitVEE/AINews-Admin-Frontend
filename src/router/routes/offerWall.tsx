import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// information module page
const TextEditorRoute: RouteObject = {
    path: '/offer-wall',
    name: 'OfferWall',
    element: <LayoutGuard />,
    meta: {
        title: '积分墙管理',
        icon: 'tree',
        orderNo: 7,
        hideChildrenInMenu: true
    },
    children: [
        {
            path: '',
            name: 'OfferWall',
            element: LazyLoad(lazy(() => import('@/views/offer-wall/offer-wall-list'))),
            meta: {
                title: '积分墙列表',
                key: 'offer-wall'
            }
        }
    ]
}

export default TextEditorRoute