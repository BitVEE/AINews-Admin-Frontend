import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'
import { ExceptionEnum } from '@/enums/exceptionEnum'

// information module page
const TextEditorRoute: RouteObject = {
    path: '/news-flash',
    name: 'NewsFlash',
    element: <LayoutGuard />,
    meta: {
        title: '快讯管理',
        icon: 'form',
        orderNo: 3
    },
    children: [
        {
            path: 'label',
            name: 'Label',
            element: LazyLoad(lazy(() => import('@/views/exception'))),
            loader: () => ({ status: ExceptionEnum.PAGE_NOT_FOUND, withCard: true }),
            meta: {
                title: '快讯源列表',
                key: 'news-flash-label'
            }
        },
        {
            path: 'list',
            name: 'List',
            element: LazyLoad(lazy(() => import('@/views/exception'))),
            loader: () => ({ status: ExceptionEnum.PAGE_NOT_FOUND, withCard: true }),
            meta: {
                title: '快讯列表',
                key: 'news-flash-list'
            }
        }
    ]
}

export default TextEditorRoute
