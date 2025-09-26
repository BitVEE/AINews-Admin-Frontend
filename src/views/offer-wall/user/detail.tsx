import { type FC, useEffect, useState } from 'react'
import {
    Button,
    Card,
    Descriptions,
    Select,
    Space,
    Tag,
    Spin,
    Input,
    Table,
} from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { getOfferWallUserDetail } from '@/api'
import dayjs from 'dayjs'
import { ColumnsType } from 'antd/es/table'
const OfferUserDetail: FC = () => {
    const query = useLocation()?.search
    const id = new URLSearchParams(query).get('id')
    const [userDetail, setUserDetail] = useState<API.OfferWallUserType | null>(null)
    const [offerRecordList, setOfferRecordList] = useState<API.OfferWallOfferRecordType[]>([])
    const [dailyList, setDailyList] = useState<API.OfferWallUserActionLogType[]>([])
    const [joinTgGroupList, setJoinTgGroupList] = useState<API.OfferWallUserActionLogType[]>([])
    const [inviteUserList, setInviteUserList] = useState<API.OfferWallInvitationType[]>([])
    const [applyList, setApplyList] = useState<API.OfferWallType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [searchId, setSearchId] = useState<string>('')
    useEffect(() => {
        if (id) {
            setSearchId(id)
        }
    }, [id])

    useEffect(() => {
        if (searchId) {
            setLoading(true)
            getOfferWallUserDetail({ id: Number(searchId) }).then((res) => {
                setUserDetail(res.data.user)
                setOfferRecordList(res.data.user?.OfferRecordList || [])
                setInviteUserList(res.data.user?.inviteUserList || [])
                setApplyList(res.data.user?.applyList || [])
                setDailyList(res.data.user?.dailyList || [])
                setJoinTgGroupList(res.data.user?.joinTgGroupList || [])
                setLoading(false)
            }).catch(() => {
                setLoading(false)
            })
        }
    }, [searchId])

    const offerRecordColumns: ColumnsType<API.OfferWallOfferRecordType> = [

        {
            title: '任务完成时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => {
                return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '任务ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '任务名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '任务状态',
            dataIndex: 'progress',
            key: 'progress',
            render: (status) => {
                return status === 1 ? '进行中' : '已完成'
            }
        },
        {
            title: '积分奖励',
            dataIndex: 'point',
            key: 'point',
        }
    ]
    const dailyColumns: ColumnsType<API.OfferWallUserActionLogType> = [
        {
            title: '时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => {
                return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '状态',
            dataIndex: 'action',
            key: 'action',
            render: () => {
                return '已完成'
            }
        },
        {
            title: '任务奖励（积分）',
            dataIndex: 'point',
            key: 'point',
        }
    ]
    const inviteUserColumns: ColumnsType<API.OfferWallInvitationType> = [
        // 时间
        {
            title: '绑定时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => {
                return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '下级ID',
            dataIndex: 'childUserId',
            key: 'childUserId',
            render: (childUserId) => {
                return <Button type='primary'>
                    <Link to={`/offer-wall/user/detail?id=${childUserId}`}>
                        查看ID: {childUserId} 详情
                    </Link>
                </Button>
            }
        },
        {
            title: '下级邮箱',
            dataIndex: 'childUserEmail',
            key: 'childUserEmail',
        },
        {
            title: '下级设备ID',
            dataIndex: 'deviceId',
            key: 'deviceId',
        },
        {
            title: '下级用户状态',
            dataIndex: 'state',
            key: 'state',
            render: (state) => {
                return state === 0 ? '不活跃' : '活跃'
            }
        },
        {
            title: '返佣奖励(积分)',
            dataIndex: 'returnPoint',
            key: 'returnPoint',
        }
    ]
    const applyColumns: ColumnsType<API.OfferWallType> = [
        {
            title: '提现申请时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => {
                return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '提现申请状态',
            dataIndex: 'state',
            key: 'state',
            render: (state) => {
                return state === 1 ? '审核中' : state === 2 ? '已通过' : '已拒绝'
            }
        },
        {
            title: '提现申请金额（积分）',
            dataIndex: 'point',
            key: 'point',
        },
        {
            title: '审核时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt) => {
                return dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')
            }
        }
    ]

    return (
        <>
            {loading && <Spin spinning={loading} tip="加载中..." />}
            {!searchId && <Input.Search style={{ width: '300px' }} placeholder="请输入用户ID" onSearch={(value) => { setSearchId(value) }} />}
            {!loading && searchId && (
                <>
                    <Card bordered={false}>
                        <div style={{ overflowX: 'scroll' }}>
                            <Descriptions title="用户详情">
                                <Descriptions.Item label="用户ID">{userDetail?.id}</Descriptions.Item>
                                <Descriptions.Item label="已邀请的用户数">{userDetail?.inviteCount}</Descriptions.Item>
                                <Descriptions.Item label="注册时间">{dayjs(userDetail?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>

                                <Descriptions.Item label="邮箱">{userDetail?.email}</Descriptions.Item>
                                <Descriptions.Item label="已完成任务数">{userDetail?.offerDoneCount}</Descriptions.Item>
                                <Descriptions.Item label="最近登录时间">{userDetail?.updatedAt ? dayjs(userDetail?.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '未登录'}</Descriptions.Item>

                                <Descriptions.Item label="渠道">{userDetail?.channel}</Descriptions.Item>
                                <Descriptions.Item label="今日是否完成签到">{userDetail?.dailyState === 0 ? '未完成' : '已完成'}</Descriptions.Item>
                                <Descriptions.Item label="最近一次签到时间">{userDetail?.lastDaily ? dayjs(userDetail?.lastDaily).format('YYYY-MM-DD HH:mm:ss') : '未签到'}</Descriptions.Item>

                                <Descriptions.Item label="IP国家">{userDetail?.ipCountry}</Descriptions.Item>
                                <Descriptions.Item label="是否加入TG群">{userDetail?.tgGroupState === 0 ? '未加入' : '已加入'}</Descriptions.Item>
                                <Descriptions.Item label="已邀请用户奖励积分数">{userDetail?.invitePoint}</Descriptions.Item>

                                <Descriptions.Item label="用户国家">{userDetail?.userCountry}</Descriptions.Item>
                                <Descriptions.Item label="邀请码">{userDetail?.inviteCode}</Descriptions.Item>
                                <Descriptions.Item label="已提现积分">{userDetail?.withdrawPoint}</Descriptions.Item>

                                <Descriptions.Item label="">  </Descriptions.Item>
                                <Descriptions.Item label="绑定上级的邀请码">{userDetail?.parentInviteCode}</Descriptions.Item>
                                <Descriptions.Item label="剩余积分">{userDetail?.point}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    </Card>
                    <br />
                    <Card bordered={false}>
                        {offerRecordList.length > 0 && <Table
                            rowKey='id'
                            title={() => <h2>任务完成记录</h2>}
                            columns={offerRecordColumns}
                            dataSource={offerRecordList}
                            loading={loading}
                            pagination={false}
                        />}
                        {dailyList.length > 0 && <Table
                            rowKey='createdAt'
                            title={() => <h2>签到任务记录</h2>}
                            columns={dailyColumns}
                            dataSource={dailyList}
                            loading={loading}
                            pagination={false}
                        />}
                        {joinTgGroupList.length > 0 && <Table
                            rowKey='createdAt'
                            title={() => <h2>加群任务（一次性任务）</h2>}
                            columns={dailyColumns}
                            dataSource={joinTgGroupList}
                            loading={loading}
                            pagination={false}
                        />}
                        {inviteUserList.length > 0 && <Table
                            rowKey='childUserId'
                            title={() => <h2>邀请用户记录</h2>}
                            columns={inviteUserColumns}
                            dataSource={inviteUserList}
                            loading={loading}
                            pagination={false}
                        />}
                        {applyList.length > 0 && <Table
                            rowKey='id'
                            title={() => <h2>提现记录</h2>}
                            columns={applyColumns}
                            dataSource={applyList}
                            loading={loading}
                            pagination={false}
                        />}
                    </Card>
                </>
            )}

        </>
    )
}

export default OfferUserDetail
