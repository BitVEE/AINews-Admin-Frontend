import type { ColumnsType } from 'antd/es/table'
import { type FC, useState, useEffect } from 'react'
import {
    Card,
    Button,
    Table,
    Space,
    Modal,
    Input,
    message,
    Form,
    Select,
    Popover,
    Tag
} from 'antd'
import { getProjectWatchList, postAddProjectWatch, postDeleteProjectWatch, postUpdateProject } from '@/api'
import dayjs from 'dayjs'
import { ExclamationCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const ProjectList: FC = () => {
    const [form] = Form.useForm()
    const [tableLoading, setTableLoading] = useState(false)
    const [tableData, setTableData] = useState<API.ProjectWatchType[]>([])
    const [showAddTable, setShowAddTable] = useState<boolean>(false)
    const [loadingEdit, setLoadingEdit] = useState<boolean>(false)

    const columns: ColumnsType<API.ProjectWatchType> = [
        {
            title: 'address',
            dataIndex: 'address',
            align: 'center',
            ellipsis: true,
            fixed: true,
            width: 200,
        },
        {
            title: '买入价格',
            dataIndex: 'startPrice',
            align: 'center',
            width: 200,
            render: (startPrice) => {
                return startPrice.toFixed(28).replace(/0+$/, '').replace(/\.$/, '')
            }
        },
        {
            title: '最新价格',
            dataIndex: 'lastPrice',
            align: 'center',
            width: 200,
            render: (lastPrice) => {
                return lastPrice.toFixed(28).replace(/0+$/, '').replace(/\.$/, '')
            }
        },
        {
            title: '峰值价格',
            dataIndex: 'topPrice',
            align: 'center',
            width: 200,
            render: (topPrice) => {
                return topPrice.toFixed(28).replace(/0+$/, '').replace(/\.$/, '')
            }
        },
        {
            title: '当前价格相对于峰值价格的变化比例',
            dataIndex: 'priceChange',
            align: 'center',
            width: 200,
            render: (priceChange) => {
                return <span>{priceChange}%</span>
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            align: 'center',
            width: 200,
            render: (createdAt) => {
                return <span>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            align: 'center',
            width: 200,
            render: (updatedAt) => {
                return <span>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
        },
        // 操作
        {
            title: '操作',
            dataIndex: 'address',
            align: 'center',
            width: 80,
            fixed: 'right',
            render: (address) => {
                return (
                    <Space>
                        <Button type='primary' danger onClick={() => { handleDelete(address) }}>删除</Button>
                    </Space>
                )
            }
        }
    ]




    async function fetchData() {
        if (tableLoading) return
        setTableLoading(true)
        getProjectWatchList().then((res) => {
            if (res.code !== 0) {
                return message.error("获取数据失败,错误码:" + res.code)
            }
            setTableData(res.data.tokens)
        }).catch(() => {
            message.error('获取项目监听列表失败')
        }).finally(() => {
            setTableLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, [])


    const onFinish = (values: any) => {
        setLoadingEdit(true)
        console.log(values)
        values.tokens = values.tokens.map((item: any) => {
            return {
                address: item.address,
                startPrice: Number(item.startPrice)
            }
        })
        console.log(values)
        editOnFinish(values)
    }

    const editOnFinish = async (values: any) => {
        setLoadingEdit(true)
        postAddProjectWatch(values).then((res: any) => {
            if (res.code !== 0) {
                return message.error("添加项目监听失败,错误码:" + res.code + "错误信息：" + res?.error)
            }
            message.success('添加项目监听成功')
            fetchData()
            setShowAddTable(false)
            form.resetFields()
        }).catch(() => {
            message.error('添加项目监听失败')
        }).finally(() => {
            setLoadingEdit(false)
        })
    }

    function handleDelete(address: string) {
        Modal.confirm({
            title: '此操作将删除当前监听token:' + address,
            icon: <ExclamationCircleOutlined rev={undefined} />,
            okType: 'danger',
            okText: '删除',
            cancelText: '取消',
            onOk() {
                return deleteOnFinish(address)
            },
            onCancel() {
            }
        })
    }

    const deleteOnFinish = async (address: string) => {
        postDeleteProjectWatch({ address }).then((res) => {
            if (res.code !== 0) {
                return message.error("删除项目监听失败,错误码:" + res.code)
            }
            message.success('删除项目监听成功')
            fetchData()
        }).catch(() => {
            message.error('删除项目监听失败')
        }).finally(() => {
            setLoadingEdit(false)
        })
    }


    return (
        <>
            <Card bordered={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', overflow: 'scroll', padding: '10px 0', gap: '10px' }}>
                    <Space>
                        <Button type='primary' onClick={() => { setShowAddTable(true) }}>新增监听token</Button>
                    </Space>
                </div>
            </Card>
            <br />
            <Card bordered={false}>
                <Table
                    rowKey='address'
                    columns={columns}
                    dataSource={tableData}
                    loading={tableLoading}
                    scroll={{ x: 'max-content', y: 'calc(100vh - 200px)' }}
                />
                <Modal
                    open={showAddTable}
                    title={'新增监控项目'}
                    closable={false}
                    footer={null}
                    width='1000px'
                    forceRender
                >
                    <Form form={form}
                        colon={false}
                        labelCol={{ span: 8 }}
                        labelAlign='left'
                        style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: "center", gap: "30px" }}
                        onFinish={onFinish}>
                        <Form.List name="tokens">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} style={{ display: 'flex', marginBottom: 8, gap: '10px' }}>
                                            <Form.Item
                                                // 必填
                                                rules={[{ required: true, message: '请输入监听token' }]}
                                                {...restField}
                                                name={[name, 'address']}
                                                label='监听token'
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                // 必填
                                                rules={[{ required: true, message: '请输入买入价格' }]}
                                                {...restField}
                                                name={[name, 'startPrice']}
                                                label='买入价格'
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Button>
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: '60%' }}
                                        icon={<PlusOutlined />}
                                    >
                                        添加监控项
                                    </Button>
                                </>
                            )}
                        </Form.List>
                        <Form.Item>
                            <Button type='primary' htmlType='submit' loading={loadingEdit}>
                                确认
                            </Button>
                            <Button style={{ marginLeft: '12px' }} onClick={() => { setShowAddTable(false); }}>
                                取消
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </>
    )
}

export default ProjectList