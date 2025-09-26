import type { ColumnsType } from 'antd/es/table'
import { type FC, useState, useEffect } from 'react'
import {
    Card,
    Button,
    Table,
    Tag,
    Space,
    message,
    Input
} from 'antd'
import { getOfferWallUserList } from '@/api'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

const OfferWallUserList: FC = () => {
    const [tableLoading, setTableLoading] = useState(false)
    const [tableData, setTableData] = useState<API.OfferWallUserType[]>([])
    const [tableTotal, setTableTotal] = useState<number>(0)
    const [tableQuery, setTableQuery] = useState<API.PageState>({ page: 1, size: 20 })
    const [query, setQuery] = useState<string>("")

    // columns
    const columns: ColumnsType<API.OfferWallUserType> = [
        {
            title: '用户ID',
            dataIndex: 'id',
            align: 'center',
            fixed: 'left',
            width: 100,
            sorter: (a, b) => a.id - b.id
        },
        {
            title: '用户邮箱',
            dataIndex: 'email',
            align: 'center',
        },
        {
            title: '账户剩余积分',
            dataIndex: 'point',
            align: 'center',
        },
        {
            title: '已提现积分',
            dataIndex: 'withdrawPoint',
            align: 'center',
            width: 100,
        },
        {
            title: '完成offer(个)',
            dataIndex: 'offerDoneCount',
            align: 'center',
            width: 100,
        },
        {
            title: '下级关系(个)',
            dataIndex: 'inviteCount',
            align: 'center',
            width: 100,
        },
        {
            title: '注册时间',
            dataIndex: 'createdAt',
            align: 'center',
            render: (updatedAt) => {
                return <span>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
        },
        {
            title: '操作',
            dataIndex: 'state',
            align: 'center',
            fixed: 'right',
            render: (state, record) => {
                return <Button type='primary'>
                    <Link to={`/offer-wall/user/detail?id=${record.id}`}>详情</Link>
                </Button>
            }
        }
    ]

    // change page
    function handlePageChange(page: number, size: number) {
        setTableQuery({ ...tableQuery, page, size })
    }

    // fetch data
    async function fetchData() {
        setTableLoading(true)
        getOfferWallUserList({ ...tableQuery, query }).then((res) => {
            if (res.code === 0) {
                const { users, total } = res.data
                setTableData(users)
                setTableTotal(total)
            } else {
                message.error(res.msg || '获取用户列表失败')
            }
        }).finally(() => {
            setTableLoading(false)
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
                            placeholder='用户邮箱或邀请码'
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
                    rowKey='id'
                    columns={columns}
                    dataSource={tableData}
                    loading={tableLoading}
                    scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
                    pagination={{
                        current: tableQuery.page,
                        pageSize: tableQuery.size,
                        total: tableTotal,
                        showTotal: () => `Total ${tableTotal} items`,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        onChange: handlePageChange
                    }}
                />
            </Card>
        </>
    )
}

export default OfferWallUserList
