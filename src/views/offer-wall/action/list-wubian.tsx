import type { ColumnsType } from 'antd/es/table'
import { type FC, useState, useEffect } from 'react'
import {
    Card,
    Table,
    Space,
    message,
    Input,
    Select
} from 'antd'
import { getOfferWallOfferRecordList } from '@/api'
import dayjs from 'dayjs'

const OfferWallUserActionWubianList: FC = () => {
    const [tableLoading, setTableLoading] = useState(false)
    const [tableData, setTableData] = useState<API.OfferWallOfferRecordType[]>([])
    const [tableTotal, setTableTotal] = useState<number>(0)
    const [tableQuery, setTableQuery] = useState<API.PageState>({ page: 1, size: 20 })
    const [query, setQuery] = useState<string>("")
    const [selectType, setSelectType] = useState<number>(0)
    const [firstLoad, setFirstLoad] = useState(true)

    // columns
    const columns: ColumnsType<API.OfferWallOfferRecordType> = [
        {
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 100,
        },
        {
            title: '用户邮箱',
            dataIndex: 'email',
            key: 'email',
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
            title: '操作时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt) => {
                return dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '积分奖励',
            dataIndex: 'point',
            key: 'point',
        }
    ]

    // change page
    function handlePageChange(page: number, size: number) {
        setTableQuery({ ...tableQuery, page, size })
    }

    // fetch data
    async function fetchData() {
        setTableLoading(true)
        getOfferWallOfferRecordList({ ...tableQuery, userId: query, progress: selectType, source: 1 }).then((res) => {
            if (res.code === 0) {
                const { data, total } = res.data
                setTableData(data)
                setTableTotal(total)
            } else {
                message.error(res.msg || '获取任务记录列表失败')
            }
        }).finally(() => {
            setTableLoading(false)
            setFirstLoad(false)
        })
    }

    useEffect(() => {
        if (tableQuery.page > 0 && tableQuery.size > 0) {
            fetchData()
        }
    }, [tableQuery.page, tableQuery.size])

    useEffect(() => {
        if (firstLoad) {
            return
        } else if (tableQuery.page !== 1) {
            setTableQuery({ ...tableQuery, page: 1 })
        } else {
            fetchData()
        }
    }, [selectType, query])



    return (
        <>
            <Card bordered={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', overflow: 'scroll', padding: '10px 0', gap: '10px' }}>
                    <Space>
                        <h3 style={{ whiteSpace: 'nowrap' }}>搜索：</h3>
                        <Input.Search
                            placeholder='用户ID'
                            allowClear
                            enterButton
                            onSearch={(value) => { setQuery(value) }}
                        />
                    </Space>
                    <Space>
                        <h3 style={{ whiteSpace: 'nowrap' }}>操作类型：</h3>
                        <Select
                            options={[
                                { label: '全部 操作', value: 0 },
                                { label: '进行中', value: 1 },
                                { label: '已完成', value: 2 },
                            ]}
                            value={selectType}
                            onChange={(e) => { setSelectType(e as number) }}
                        />
                    </Space>
                </div>
            </Card>
            <br />
            <Card bordered={false}>
                <Table
                    rowKey='createdAt'
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

export default OfferWallUserActionWubianList
