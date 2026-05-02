import React from 'react'
import { Typography, Space } from 'antd'

const { Title } = Typography

interface SectionHeaderProps {
  title: string
  icon?: React.ReactNode
  extra?: React.ReactNode
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon, extra }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <Space>
        {icon && <span style={{ fontSize: '20px' }}>{icon}</span>}
        <Title level={4} style={{ margin: 0 }}>{title}</Title>
      </Space>
      {extra && <div>{extra}</div>}
    </div>
  )
}

export default SectionHeader