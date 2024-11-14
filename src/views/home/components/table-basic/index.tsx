import type { ColumnsType } from 'antd/es/table'
import { type FC, useState, useEffect } from 'react'
import {
  type TableProps,
  Card,
  Table,
} from 'antd'
import { getHomeAllList } from '@/api'
import type { APIResult, PageState, TableAllDataType } from './types'
import dayjs from 'dayjs'

const TableBasic: FC = () => {
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState<TableAllDataType[]>([])
  const [tableTotal, setTableTotal] = useState<number>(0)
  const [tableQuery, setTableQuery] = useState<PageState>({ current: 1, pageSize: 10 })


  const columns: ColumnsType<TableAllDataType> = [
    {
      title: '日期',
      dataIndex: 'create_time',
      align: 'center',
      render: (create_time) => {
        return <span>{dayjs(create_time).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    },
    {
      title: '新增人数（人）',
      dataIndex: 'user_number',
      align: 'center'
    },
    {
      title: '新增资讯',
      dataIndex: 'information_number',
      align: 'center'
    },
    {
      title: '新增快讯',
      dataIndex: 'news_flash_number',
      align: 'center'
    },
    {
      title: '新增AI问答',
      dataIndex: 'ai_number',
      align: 'center'
    },
  ]

  const tableSelection: TableProps<any>['rowSelection'] = {
    onChange: (selectedRowKeys: any[]) => {
      console.log(selectedRowKeys)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tableQuery])

  async function fetchData() {
    setTableLoading(true)
    const data = await getHomeAllList(tableQuery)
    const { list, total } = data as unknown as APIResult
    setTableData(list)
    setTableTotal(total)
    setTableLoading(false)
  }

  function handlePageChange(page: number, pageSize: number) {
    setTableQuery({ ...tableQuery, current: page, pageSize })
  }


  return (
    <Card bordered={false}>
      <Table
        rowKey='id'
        rowSelection={tableSelection}
        columns={columns}
        dataSource={tableData}
        loading={tableLoading}
        pagination={{
          current: tableQuery.current,
          pageSize: tableQuery.pageSize,
          total: tableTotal,
          showTotal: () => `Total ${tableTotal} items`,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handlePageChange
        }}
        title={() => { return <h1>数据统计表</h1> }}
      />
    </Card>
  )
}

export default TableBasic
