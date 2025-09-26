import { type FC, useEffect, useState } from 'react'
import {
    Card,
    Space,
    Input,
    Table,
    message,
} from 'antd'
import { getOfferWallInvitationList } from '@/api'
import dayjs from 'dayjs'
import { ColumnsType } from 'antd/es/table'
const OfferWallUserRelation: FC = () => {
    const [inviteUserList, setInviteUserList] = useState<API.OfferWallInvitationType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [total, setTotal] = useState<number>(0)
    const [tableQuery, setTableQuery] = useState<API.PageState>({ page: 1, size: 20 })
    const [query, setQuery] = useState<string>("")

    const inviteUserColumns: ColumnsType<API.OfferWallInvitationType> = [
        {
            title: '用户ID',
            dataIndex: 'parentUserId',
            key: 'parentUserId',
            width: 100
        },
        {
            title: '用户邮箱',
            dataIndex: 'parentUserEmail',
            key: 'parentUserEmail',
        },
        {
            title: '下级ID',
            dataIndex: 'childUserId',
            key: 'childUserId',
            width: 100
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
            align: 'center',
            width: 150,
            render: (state) => {
                return state === 0 ? '不活跃' : '活跃'
            }
        },
        {
            title: '返佣奖励(积分)',
            dataIndex: 'returnPoint',
            key: 'returnPoint',

            width: 150
        },
        {
            title: '绑定时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => {
                return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
            }
        },
    ]
    // change page
    function handlePageChange(page: number, size: number) {
        setTableQuery({ ...tableQuery, page, size })
    }

    // fetch data
    async function fetchData() {
        setLoading(true)
        getOfferWallInvitationList({ ...tableQuery, parentUserEmail: query }).then((res) => {
            if (res.code === 0) {
                const { data, total } = res.data
                setInviteUserList(data)
                setTotal(total)
            } else {
                message.error(res.msg || '获取邀请用户列表失败')
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    // fetch data when page change
    useEffect(() => {
        if (tableQuery.page !== 0 && tableQuery.size !== 0) {
            fetchData()
        }
    }, [tableQuery.page, tableQuery.size, query])
    return (
        <>
            <Card bordered={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', overflow: 'scroll', padding: '10px 0', gap: '10px' }}>
                    <Space>
                        <h3 style={{ whiteSpace: 'nowrap' }}>搜索：</h3>
                        <Input.Search
                            placeholder='用户邮箱'
                            allowClear
                            enterButton
                            onSearch={(value) => { setQuery(value) }}
                        />
                    </Space>
                </div>
            </Card>
            <br />
            <Card bordered={false}>
                <Table
                    rowKey='childUserId'
                    title={() => <h2>邀请用户记录</h2>}
                    columns={inviteUserColumns}
                    dataSource={inviteUserList}
                    loading={loading}
                    scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
                    pagination={{
                        current: tableQuery.page,
                        pageSize: tableQuery.size,
                        total: total,
                        showTotal: () => `Total ${total} items`,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        onChange: handlePageChange
                    }}
                />
            </Card>

        </>
    )
}

export default OfferWallUserRelation
