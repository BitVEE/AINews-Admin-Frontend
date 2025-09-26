import type { EChartsOption } from 'echarts'
// countUpDataType
export type countUpDataType = {
  title: string
  icon: string
  count: number
  color: string
}

export const countUpData: countUpDataType[] = [
  { title: '总用户数', icon: 'location', count: 0, color: '#1890ff' },
  { title: '今日注册用户数', icon: 'person', count: 0, color: '#fa541c' },
  { title: '总Offer数', icon: 'compo', count: 0, color: '#52c41a' },
  { title: '今日新增Offer数', icon: 'person', count: 0, color: '#722ed1' },
  { title: '总完成Offer奖励积分数', icon: 'flow', count: 0, color: '#faad14' },
  { title: '今日完成Offer奖励积分数', icon: 'person', count: 0, color: '#13c2c2' },
  { title: '总已提现积分数', icon: 'heart', count: 0, color: '#eb2f96' },
  { title: '总提现审核中积分数', icon: 'table', count: 0, color: '#fadb14' },
  { title: '总Offer完成数', icon: 'tree', count: 0, color: '#a0d911' },
  { title: '今日Offer完成数', icon: 'hints', count: 0, color: '#fa8c16' },
  { title: '总Offer完成率(%)', icon: 'like', count: 0, color: '#1890ff' }
]


export const lineOptions: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      lineStyle: {
        width: 1,
        color: '#fa541c'
      }
    }
  },
  grid: {
    left: 0,
    right: '1%',
    top: '2%',
    bottom: 0,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: 'value',
    max: value => {
      return value.max + Math.ceil((value.max + value.min) / 2)
    }
  },
  label: {
    show: true,
    fontSize: 14,
    color: '#722ed1',
    position: 'top',
    formatter: ''
  },
  series: [
    {
      type: 'line',
      name: '数量',
      color: ['#722ed1'],
      smooth: true,
      data: [782, 925, 1196, 812, 328, 223, 1080]
    }
  ]
}