import type { FC } from 'react'
import { Card } from 'antd'
import CountUp from 'react-countup'
import SvgIcon from '@/components/SvgIcon'

interface propState {
  loading: boolean
  title: string
  color: string
  iconName: string
  countNum: number
}

const CountUpCard: FC<propState> = props => {
  return (
    <Card style={{ minWidth: "min(240px,100%)" }} loading={props.loading} bordered={false} bodyStyle={{ padding: 0, marginBottom: 5 }}>
      <div className='flex-center-v'>
        <div
          className='flex-center'
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '8px 0 0 8px',
            background: props.color
          }}
        >
          <SvgIcon name={props.iconName} size={40} style={{ color: '#fff' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <CountUp
            start={0}
            end={props.countNum}
            duration={3}
            decimals={Number((props.countNum + "").split(".")[1]?.length || 0)}
            style={{
              fontSize: '32px',
              color: '#515a6e'
            }}
          />
          <p style={{ fontSize: '16px' }}>{props.title}</p>
        </div>
      </div>
    </Card>
  )
}

export default CountUpCard
