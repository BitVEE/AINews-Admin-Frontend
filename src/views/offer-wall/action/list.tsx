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
import { getOfferWallUserActionLogList } from '@/api'
import dayjs from 'dayjs'
import { OfferWallUserActionLogTypeAction } from '@/enums/menuEnum'

const OfferWallUserActionList: FC = () => {
    const [tableLoading, setTableLoading] = useState(false)
    const [tableData, setTableData] = useState<API.OfferWallUserActionLogType[]>([])
    const [tableTotal, setTableTotal] = useState<number>(0)
    const [tableQuery, setTableQuery] = useState<API.PageState>({ page: 1, size: 20 })
    const [query, setQuery] = useState<string>("")
    const [selectType, setSelectType] = useState<OfferWallUserActionLogTypeAction>(0)
    const [firstLoad, setFirstLoad] = useState(true)

    // columns
    const columns: ColumnsType<API.OfferWallUserActionLogType> = [
        {
            title: '用户ID',
            dataIndex: 'userId',
            align: 'center',
            fixed: 'left',
            width: 100,
            sorter: (a, b) => a.userId - b.userId
        },
        {
            title: '用户邮箱',
            dataIndex: 'email',
            align: 'center',
        },

        {
            title: '设备ID',
            dataIndex: 'deviceId',
            key: 'deviceId',
        },
        {
            title: '获得积分',
            dataIndex: 'point',
            align: 'center',
            width: 100,
        },
        {
            title: '任务ID',
            dataIndex: 'extra',
            align: 'center',
            width: 100,
            render: (extra) => {
                return <span>{extra?.offerId || '-'}</span>
            }
        },
        {
            title: '源任务ID',
            dataIndex: 'extra',
            align: 'center',
            width: 100,
            render: (extra) => {
                return <span>{extra?.sourceOfferId || '-'}</span>
            }
        },
        {
            title: '操作时间',
            dataIndex: 'createdAt',
            align: 'center',
            render: (updatedAt) => {
                return <span>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
        },
        {
            title: '用户国家',
            dataIndex: 'userCountry',
            align: 'center',
            width: 100,
        },
        {
            title: 'IP国家',
            dataIndex: 'ipCountry',
            align: 'center',
            width: 100,
        },
        {
            title: '操作类型',
            dataIndex: 'action',
            align: 'center',
            width: 100,
            render: (action) => {
                return <span>{OfferWallUserActionLogTypeAction[action] || '-'}</span>
            }
        },
    ]

    // change page
    function handlePageChange(page: number, size: number) {
        setTableQuery({ ...tableQuery, page, size })
    }

    // fetch data
    async function fetchData() {
        setTableLoading(true)
        getOfferWallUserActionLogList({ ...tableQuery, userId: query, action: selectType }).then((res) => {
            if (res.code === 0) {
                const { data, total } = res.data
                setTableData(data)
                setTableTotal(total)
            } else {
                message.error(res.msg || '获取积分日志列表失败')
            }
        }).finally(() => {
            setFirstLoad(false)
            setTableLoading(false)
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
                                { label: '签到', value: 3 },
                                { label: '加TG群', value: 4 },
                                { label: '完成任务', value: 7 },
                                { label: '下级返佣', value: 8 },
                                { label: '绑定下级', value: 6 },
                                { label: '提现', value: 9 },
                            ]}
                            value={selectType}
                            onChange={(e) => { setSelectType(e as API.OfferWallUserActionLogType['action']) }}
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

export default OfferWallUserActionList