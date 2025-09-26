import { type FC, useState, useEffect } from 'react'
import { Row, Col, Space, DatePicker } from 'antd'
import CountUpCard from './components/CountUpCard'
import ChartsCard from './components/ChartsCard'
import { countUpData, lineOptions, countUpDataType } from './data'
import { getOfferWallCommonStats, getOfferWallOfferStatsChart, getOfferWallUserStatsChart } from '@/api'
import dayjs from 'dayjs'
import { EChartsOption } from 'echarts'

const HomePage: FC = () => {
  // 系统统计值
  const [isLoading, setIsLoading] = useState(true)
  const [offerWallData, setOfferWallData] = useState<countUpDataType[]>(countUpData)

  // 用户表格时间范围
  const [userStartTime, setUserStartTime] = useState(dayjs().subtract(7, 'day'))
  const [userEndTime, setUserEndTime] = useState(dayjs())
  const [userData, setUserData] = useState<EChartsOption>(lineOptions)
  const [userLoading, setUserLoading] = useState(true)

  // 任务表格时间范围
  const [offerStartTime, setOfferStartTime] = useState(dayjs().subtract(7, 'day'))
  const [offerEndTime, setOfferEndTime] = useState(dayjs())
  const [offerData, setOfferData] = useState<EChartsOption>(lineOptions)
  const [offerLoading, setOfferLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getOfferWallCommonStats().then(res => {
      offerWallData.forEach(item => {
        if (item.title === '总用户数') {
          item.count = res.data.totalUserCount
        } else if (item.title === '今日注册用户数') {
          item.count = res.data.todayUserCount
        } else if (item.title === '总Offer数') {
          item.count = res.data.totalOfferCount
        } else if (item.title === '今日新增Offer数') {
          item.count = res.data.todayOfferCount
        } else if (item.title === '总完成Offer奖励积分数') {
          item.count = res.data.totalOfferRewardPoint
        } else if (item.title === '今日完成Offer奖励积分数') {
          item.count = res.data.todayOfferRewardPoint
        } else if (item.title === '总已提现积分数') {
          item.count = res.data.totalWithdrawDonePoint
        } else if (item.title === '总提现审核中积分数') {
          item.count = res.data.totalWithdrawDoingPoint
        } else if (item.title === '总Offer完成数') {
          item.count = res.data.totalOfferDoneCount
        } else if (item.title === '今日Offer完成数') {
          item.count = res.data.todayOfferDoneCount
        } else if (item.title === '总Offer完成率(%)') {
          item.count = res.data.totalOfferDonePercent
        }
      })
      setOfferWallData(offerWallData)
    }).catch(err => {
    }).finally(() => {
      setIsLoading(false)
    })
  }, [countUpData.length])

  // get offerWall stats chart
  useEffect(() => {
    setOfferLoading(true)
    getOfferWallOfferStatsChart({
      startDate: dayjs(offerStartTime).format('YYYY-MM-DD'),
      endDate: dayjs(offerEndTime).format('YYYY-MM-DD')
    }).then(res => {
      setOfferData({
        ...offerData,
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: res.data.timeLine
        },
        series: [{
          type: 'line',
          name: '数量',
          color: ['#722ed1'],
          smooth: true,
          data: res.data.data
        }]
      })
    }).catch(err => {
    }).finally(() => {
      setOfferLoading(false)
    })
  }, [offerEndTime])


  // get userWall stats chart
  useEffect(() => {
    setUserLoading(true)
    getOfferWallUserStatsChart({
      startDate: dayjs(userStartTime).format('YYYY-MM-DD'),
      endDate: dayjs(userEndTime).format('YYYY-MM-DD')
    }).then(res => {
      setUserData({
        ...userData,
        xAxis: {
          type: 'category',
          data: res.data.timeLine,
          axisTick: {
            alignWithLabel: true
          }
        },
        series: [{
          type: 'line',
          name: '数量',
          color: ['#722ed1'],
          smooth: true,
          data: res.data.data
        }]
      })
    }).catch(err => {
    }).finally(() => {
      setUserLoading(false)
    })
  }, [userEndTime])

  return (
    <Space direction='vertical' size={12} style={{ display: 'flex', minWidth: '480px', overflowX: 'hidden' }}>
      <Row gutter={12}>
        {offerWallData.map(item => {
          return (
            <Col flex={1} key={item.title}>
              <CountUpCard
                loading={isLoading}
                title={item.title}
                color={item.color}
                iconName={item.icon}
                countNum={item.count}
              />
            </Col>
          )
        })}
      </Row>
      <Row gutter={12}>
        <Col span={24}>
          <ChartsCard
            loading={userLoading}
            options={userData}
            height={400}
            title={
              <div style={{ display: 'flex', gap: 20, padding: 20, flexWrap: 'wrap' }}>
                <h1> 新增用户统计表 </h1>
                <DatePicker.RangePicker
                  format='YYYY-MM-DD'
                  disabled={[false, true]}
                  value={[dayjs(userStartTime), dayjs(userEndTime)]}
                  defaultValue={[dayjs(userStartTime), dayjs(userEndTime)]}
                  disabledDate={current => current.isAfter(dayjs().subtract(7, 'day'))}
                  onChange={dates => {
                    if (dates) {
                      setUserStartTime(dates[0] ? dayjs(dates[0]) : dayjs().subtract(7, 'day'))
                      setUserEndTime(dates[0] ? dayjs(dates[0]).add(7, 'day') : dayjs())
                    }
                  }}
                />
              </div>}
          />
        </Col>
        <Col span={24}>
          <ChartsCard
            loading={offerLoading}
            options={offerData}
            height={400}
            title={<div style={{ display: 'flex', gap: 20, padding: 20, flexWrap: 'wrap' }}>
              <h1> 新增Offer统计表 </h1>
              <DatePicker.RangePicker
                format='YYYY-MM-DD'
                disabled={[false, true]}
                value={[dayjs(offerStartTime), dayjs(offerEndTime)]}
                defaultValue={[dayjs(offerStartTime), dayjs(offerEndTime)]}
                disabledDate={current => current.isAfter(dayjs().subtract(7, 'day'))}
                onChange={dates => {
                  if (dates) {
                    setOfferStartTime(dates[0] ? dayjs(dates[0]) : dayjs().subtract(7, 'day'))
                    setOfferEndTime(dates[0] ? dayjs(dates[0]).add(7, 'day') : dayjs())
                  }
                }}
              />
            </div>}
          />
        </Col>
      </Row>
    </Space>
  )
}

export default HomePage
