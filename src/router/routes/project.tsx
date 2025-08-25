import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// information module page
const ProjectRoute: RouteObject = {
    path: '/project',
    name: 'Project',
    element: <LayoutGuard />,
    meta: {
        title: '推荐项目管理',
        icon: 'tree',
        orderNo: 6,
        hideChildrenInMenu: false
    },
    children: [
        {
            path: 'project-list',
            name: 'ProjectList',
            element: LazyLoad(lazy(() => import('@/views/project/project-list'))),
            meta: {
                title: '项目列表',
                key: 'project-list'
            }
        },
        // 项目监听列表
        {
            path: 'project-watch-list',
            name: 'ProjectWatchList',
            element: LazyLoad(lazy(() => import('@/views/project/project-watch-list'))),
            meta: {
                title: '项目监听列表',
                key: 'project-watch-list'
            }
        },
    ]
}

export default ProjectRoute