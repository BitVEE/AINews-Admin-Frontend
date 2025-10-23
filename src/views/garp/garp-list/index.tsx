import type { ColumnsType } from 'antd/es/table'
import { type FC, useState, useEffect } from 'react'
import {
  Card,
  Table,
  message,
} from 'antd'
import { getGARPList } from '@/api'
import dayjs from 'dayjs'

const GARPList: FC = () => {
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState<API.GARPType[]>([])
  const [tableTotal, setTableTotal] = useState<number>(0)
  const [tableQuery, setTableQuery] = useState<API.PageState>({ page: 1, size: 10 })

  const columns: ColumnsType<API.GARPType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      sorter: true,
      width: 50,
      fixed: 'left'
    },
    {
      title: '来源',
      dataIndex: 'source',
      align: 'center',
      render: (source) => {
        return <span>{source}</span>
      },
      width: 200,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      render: (email) => {
        return <span>{email}</span>
      },
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'note',
      align: 'center',
      render: (note) => {
        return <span>{note}</span>
      },
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      render: (createdAt) => {
        return <span>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
      width: 250
    },
  ]

  useEffect(() => {
    if (tableQuery.page !== 0 && tableQuery.size !== 0 && tableQuery.page !== 1) {
      fetchData()
    }
  }, [tableQuery.page, tableQuery.size])

  useEffect(() => {
    setTableQuery({ ...tableQuery, page: 1 })
    fetchData(1)
  }, [])

  async function fetchData(page?: number) {
    if (tableLoading) return
    setTableLoading(true)
    if (page) {
      getGARPList({ ...tableQuery, page: page || tableQuery.page }).then((res: any) => {
        if (res.code !== 0) {
          return message.error("获取数据失败,错误码:" + res.code)
        }
        setTableData(res.data.data)
        setTableTotal(res.data.total)
      }).catch(() => {
        message.error('获取CARP列表失败')
      }).finally(() => {
        setTableLoading(false)
      })
    } else {
      getGARPList(tableQuery).then((res: any) => {
        if (res.code !== 0) {
          return message.error("获取数据失败,错误码:" + res.code)
        }
        const { data, total } = res.data
        setTableData(data)
        setTableTotal(total)
      }).catch(() => {
        message.error('获取CARP列表失败')
      }).finally(() => {
        setTableLoading(false)
      })
    }
  }

  function handlePageChange(page: number, size: number) {
    setTableQuery({ ...tableQuery, page, size })
  }


  return (
    <>
      <Card bordered={false}>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={tableData}
          loading={tableLoading}
          pagination={{
            current: tableQuery.page,
            pageSize: tableQuery.size,
            total: tableTotal,
            showTotal: () => `Total ${tableTotal} items`,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handlePageChange
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
        />
      </Card>
    </>
  )
}

export default GARPList

