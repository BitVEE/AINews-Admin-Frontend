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
    Select
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { postUpdateOfferWallOffer, getOfferWallOfferList, getOfferWallList } from '@/api'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

const OfferWallList: FC = () => {
    const [tableLoading, setTableLoading] = useState(false)
    const [tableData, setTableData] = useState<API.OfferWallOfferType[]>([])
    const [tableTotal, setTableTotal] = useState<number>(0)
    const [tableQuery, setTableQuery] = useState<API.PageState>({ page: 1, size: 20 })
    const [state, setState] = useState<-1 | 0 | 1 | 2>(-1)

    // columns
    const columns: ColumnsType<API.OfferWallOfferType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
            width: 50,
            fixed: 'left',
            sorter: (a, b) => a.id - b.id
        },
        {
            title: 'OfferID',
            dataIndex: '["data","offer_id"]',
            align: 'center',
            width: 150,
            render: (_, record: any) => {
                return <span>{record.data.offer_id}</span>
            }
        },
        {
            title: 'offerName',
            dataIndex: 'offer_name',
            align: 'center',
            width: 100,
            render: (_, record: any) => {
                return <span>{record.data.app_name}</span>
            }
        },
        {
            title: 'displayName',
            dataIndex: 'display_name',
            align: 'center',
            width: 100,
            render: (_, record: any) => {
                return <span>{record.displayName}</span>
            }
        },
        {
            title: '平台',
            dataIndex: 'platform',
            align: 'center',
            width: 150
        },
        {
            title: '分成比例',
            dataIndex: 'percent',
            align: 'center',
            width: 100
        },
        {
            title: 'cap',
            dataIndex: 'daily_cap',
            align: 'center',
            width: 100,
            render: (_, record: any) => {
                return <span>{record.currentCap} / {record.data.daily_cap}</span>
            }
        },
        {
            title: 'state',
            dataIndex: 'state',
            align: 'center',
            width: 100,
            render: (_, record: any) => {
                return <span>{record.state === 0 ? <Tag color="orange">未开始</Tag> : record.state === 1 ? <Tag color="green">已开始</Tag> : <Tag color="red">已删除</Tag>}</span>
            }
        },

        // {
        //     title: '注册时间',
        //     dataIndex: 'createdAt',
        //     align: 'center',
        //     width: 200,
        //     sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
        //     render: (createdAt) => {
        //         return <span>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        //     }
        // },
        // {
        //     title: '更新时间',
        //     dataIndex: 'updatedAt',
        //     align: 'center',
        //     width: 200,
        //     sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
        //     render: (updatedAt) => {
        //         return <span>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        //     }
        // },
        {
            title: '操作',
            dataIndex: 'state',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (_, record: any) => (
                <Space>
                    <Button type="primary">
                        <Link to={`/offer-wall/offer-edit`} state={{ id: record.id }}>修改</Link>
                    </Button>
                </Space>
            )
        }
    ]

    // change page
    function handlePageChange(page: number, size: number) {
        setTableQuery({ ...tableQuery, page, size })
    }

    // fetch data
    async function fetchData() {
        setTableLoading(true)
        getOfferWallOfferList({ ...tableQuery, source: 1, state: state !== -1 ? state : undefined }).then((res: any) => {
            // getOfferWallList({ ...tableQuery, state, source: 1 }).then((res: any) => {
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
        return postUpdateOfferWallOffer({ id, state }).then((res: any) => {
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
                            <Select.Option value={-1}>所有状态</Select.Option>
                            <Select.Option value={0}>未开始</Select.Option>
                            <Select.Option value={1}>已开始</Select.Option>
                            <Select.Option value={2}>已删除</Select.Option>
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