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
    Popover,
    Form,
    Input
} from 'antd'

import { getOfferWallList, postUpdateOfferWall } from '@/api'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

const OfferWallList: FC = () => {
    const [tableLoading, setTableLoading] = useState(false)
    const [tableData, setTableData] = useState<API.OfferWallType[]>([])
    const [tableTotal, setTableTotal] = useState<number>(0)
    const [tableQuery, setTableQuery] = useState<API.PageState>({ page: 1, size: 20 })
    const [state, setState] = useState<0 | 1 | 2>(1)
    const [passModalVisible, setPassModalVisible] = useState(false)
    const [rejectModalVisible, setRejectModalVisible] = useState(false)
    const [currentId, setCurrentId] = useState<number | null>(null)
    const [transactionHash, setTransactionHash] = useState('')
    const [rejectReason, setRejectReason] = useState('')
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [form] = Form.useForm()

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
        ...(state === 2 ? [{
            title: '交易哈希',
            dataIndex: 'transactionHash',
            align: 'center' as const,
            width: 300
        }] : []),
        ...(state === 0 ? [{
            title: '拒绝原因',
            dataIndex: 'failReason',
            align: 'center' as const,
            width: 300
        }] : []),
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

    // 拒绝审核
    function handleNotPass(id: number) {
        setCurrentId(id)
        setRejectModalVisible(true)
    }

    // 通过审核
    function handlePass(id: number) {
        setCurrentId(id)
        setPassModalVisible(true)
    }

    // 确认拒绝审核
    function handleConfirmReject() {
        if (!rejectReason.trim()) {
            message.error('请选择拒绝原因')
            return
        }

        if (currentId) {
            setConfirmLoading(true)
            handleUpdateOfferWall(currentId, 0, rejectReason).finally(() => {
                setConfirmLoading(false)
            }).then(() => {
                setRejectModalVisible(false)
                setRejectReason('')
                setCurrentId(null)
                form.resetFields()
            })
        }
    }

    // 确认通过审核
    function handleConfirmPass() {
        if (!transactionHash.trim()) {
            message.error('请输入交易hash')
            return
        }

        if (currentId) {
            setConfirmLoading(true)
            handleUpdateOfferWall(currentId, 2, transactionHash).finally(() => {
                setConfirmLoading(false)
            }).then(() => {
                setPassModalVisible(false)
                setTransactionHash('')
                setCurrentId(null)
                form.resetFields()
            })
        }
    }

    // 取消操作
    function handleCancel() {
        setPassModalVisible(false)
        setRejectModalVisible(false)
        setTransactionHash('')
        setRejectReason('')
        setCurrentId(null)
        form.resetFields()
    }

    // update offer wall status
    function handleUpdateOfferWall(id: number, state: 0 | 1 | 2, extraData?: string) {
        const params: any = { id, state }

        // 根据状态传入不同的参数
        if (state === 2 && extraData) {
            // 通过审核时传入交易hash
            params.transactionHash = extraData
        } else if (state === 0 && extraData) {
            // 拒绝审核时传入拒绝原因
            params.failReason = extraData
        }
        return postUpdateOfferWall(params).then((res: any) => {
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
            <Modal
                title="通过提现审核"
                open={passModalVisible}
                onOk={handleConfirmPass}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okText="确认通过"
                cancelText="取消"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="交易Hash"
                        required
                        name="transactionHash"
                        rules={[{ required: true, message: '请输入交易hash', validateTrigger: ['change', 'blur', 'submit'] }]}
                    >
                        <Input
                            value={transactionHash}
                            placeholder="请输入交易hash"
                            onChange={(e) => setTransactionHash(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="拒绝提现审核"
                open={rejectModalVisible}
                onOk={handleConfirmReject}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okText="确认拒绝"
                cancelText="取消"
                okType="danger"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="拒绝原因"
                        required
                        name="rejectReason"
                        rules={[{ required: true, message: '请选择拒绝原因', validateTrigger: ['change', 'blur', 'submit'] }]}
                    >
                        <Select
                            placeholder="请选择拒绝原因"
                            value={rejectReason}
                            onChange={(value) => setRejectReason(value)}
                        >
                            <Select.Option value="Inactive referral included">Inactive referral included</Select.Option>
                            <Select.Option value="Violation of User Agreement">Violation of User Agreement</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default OfferWallList