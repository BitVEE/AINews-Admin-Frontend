import type { ColumnsType } from 'antd/es/table'
import { type FC, useState, useEffect } from 'react'
import {
    Card,
    Button,
    Table,
    Tag,
    Space,
    Modal,
    message,
    Select,
    Popover
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getOfferWallList, postUpdateOfferWall } from '@/api'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

const OfferWallList: FC = () => {
    const [tableLoading, setTableLoading] = useState(false)
    const [tableData, setTableData] = useState<API.OfferWallType[]>([])
    const [tableTotal, setTableTotal] = useState<number>(0)
    const [tableQuery, setTableQuery] = useState<API.PageState>({ page: 1, size: 20 })
    const [state, setState] = useState<0 | 1 | 2>(1)

    // columns
    const columns: ColumnsType<API.OfferWallType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
            width: 50,
            fixed: 'left',
            sorter: (a, b) => a.id - b.id
        },
        {
            title: '用户信息',
            dataIndex: 'userId',
            align: 'center',
            width: 150,
            render: (id, record) => {

                const content = (
                    <div>
                        <p>用户ID: {id.toString()}</p>
                        <p>邮箱: {record.email}</p>
                        <br />
                        <Button type='primary'>
                            <Link to={`/offer-wall/user/detail?id=${record.userId}`}>查看用户详情</Link>
                        </Button>
                    </div>
                )
                return <Popover content={content}>
                    <Tag color='blue'>{id.toString() + ' ' + record.email}</Tag>
                </Popover>
            }
        },
        {
            title: '钱包类型',
            dataIndex: 'walletType',
            align: 'center',
            width: 150
        },
        {
            title: '钱包地址',
            dataIndex: 'walletAddress',
            align: 'center',
            width: 300
        },
        {
            title: '积分',
            dataIndex: 'point',
            align: 'center',
            width: 100
        },
        {
            title: '注册时间',
            dataIndex: 'createdAt',
            align: 'center',
            width: 200,
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (createdAt) => {
                return <span>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            align: 'center',
            width: 200,
            sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
            render: (updatedAt) => {
                return <span>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
        },
        {
            title: '操作',
            dataIndex: 'state',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (state, record) => {
                return state === 1 ?
                    <Space>
                        <Button type='primary' onClick={() => handlePass(record.id)}>通过</Button>
                        <Button type='default' danger onClick={() => handleNotPass(record.id)}>拒绝</Button>
                    </Space>
                    : state === 0 ?
                        <Button type='primary' disabled>已拒绝</Button>
                        : state === 2 ?
                            <Button type='primary' disabled>已通过</Button>
                            : null
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
        getOfferWallList({ ...tableQuery, state }).then((res: any) => {
            if (res.code === 0) {
                const { data, total } = res.data
                setTableData(data)
                setTableTotal(total)
            } else {
                message.error(res.message)
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
    }, [tableQuery.page, tableQuery.size, state])

    // batch black
    function handleNotPass(id: number) {
        if (id) {
            Modal.confirm({
                title: '此操作将拒绝审核，ID:（' + id + '）是否继续?',
                icon: <ExclamationCircleOutlined rev={undefined} />,
                okType: 'danger',
                okText: '拒绝',
                cancelText: '取消',
                onOk() {
                    handleUpdateOfferWall(id, 0)
                },
                onCancel() {
                    console.log('Cancel')
                }
            })
        }
    }

    // batch restore
    function handlePass(id: number) {
        Modal.confirm({
            title: '此操作将通过审核，ID:（' + id + '）是否继续?',
            icon: <ExclamationCircleOutlined rev={undefined} />,
            okText: '通过',
            cancelText: '取消',
            onOk() {
                handleUpdateOfferWall(id, 2)
            },
            onCancel() {
                console.log('Cancel')
            }
        })
    }

    // update user is active
    function handleUpdateOfferWall(id: number, state: 0 | 1 | 2) {
        return postUpdateOfferWall({ id, state }).then((res: any) => {
            if (res.code === 0) {
                message.success('操作成功')
                fetchData()
            } else {
                message.error(res.message)
            }
        })
    }

    return (
        <>
            <Card bordered={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', overflow: 'scroll', padding: '10px 0', gap: '10px' }}>
                    <Space>
                        <h3 style={{ whiteSpace: 'nowrap' }}>选择状态:</h3>
                        <Select value={state} onChange={(value) => { setState(value) }}>
                            <Select.Option value={0}>已拒绝</Select.Option>
                            <Select.Option value={1}>待审批</Select.Option>
                            <Select.Option value={2}>已通过</Select.Option>
                        </Select>
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

export default OfferWallList