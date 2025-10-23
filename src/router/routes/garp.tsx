import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// information module page
const TextEditorRoute: RouteObject = {
    path: '/garp-list',
    name: 'GARPList',
    element: <LayoutGuard />,
    meta: {
        title: 'GARP',
        icon: 'editor',
        orderNo: 8,
        hideChildrenInMenu: true
    },
    children: [
        {
            path: '',
            name: 'GARPList',
            element: LazyLoad(lazy(() => import('@/views/garp/garp-list'))),
            meta: {
                title: 'GARP列表',
                key: 'garp-list'
            }
        }
    ]
}

export default TextEditorRoute