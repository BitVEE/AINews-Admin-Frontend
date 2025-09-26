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
        hideChildrenInMenu: false
    },
    children: [
        {
            path: 'user',
            name: 'OfferWallUser',
            meta: {
                title: '用户管理',
                key: 'user'
            },
            children: [
                {
                    path: 'list',
                    name: 'OfferWallUserList',
                    element: LazyLoad(lazy(() => import('@/views/offer-wall/user/list'))),
                    meta: {
                        title: '用户列表',
                        key: 'user-list'
                    }
                }

                , {
                    path: 'detail',
                    name: 'OfferWallUserDetail',
                    element: LazyLoad(lazy(() => import('@/views/offer-wall/user/detail'))),
                    loader: () => ({ id: 0 }),
                    meta: {
                        title: '用户详情',
                        key: 'user-detail',
                        hideMenu: true,
                    }
                },
                {
                    path: 'relation',
                    name: 'OfferWallUserRelation',
                    element: LazyLoad(lazy(() => import('@/views/offer-wall/user/relation'))),
                    meta: {
                        title: '用户关系表',
                        key: 'user-relation'
                    }
                },
            ]
        },
        {
            path: 'offer-wall-project-list',
            name: 'OfferWallProjectList',
            element: LazyLoad(lazy(() => import('@/views/offer-wall/offer-wall-project-list'))),
            meta: {
                title: '悟变任务列表',
                key: 'project-list'
            }
        },
        {
            path: 'offer-wall-withdraw-list',
            name: 'OfferWall',
            element: LazyLoad(lazy(() => import('@/views/offer-wall/offer-wall-withdraw-list'))),
            meta: {
                title: '提现列表',
                key: 'offer-wall-withdraw-list'
            }
        },
        {
            path: "offer-edit",
            name: "OfferEdit",
            element: LazyLoad(lazy(() => import("@/views/offer-wall/offer-edit"))),
            loader: () => ({ id: 0 }),
            meta: {
                title: '修改任务',
                key: 'offer-edit',
                hideMenu: true,
            },
        },

    ]
}

export default TextEditorRoute