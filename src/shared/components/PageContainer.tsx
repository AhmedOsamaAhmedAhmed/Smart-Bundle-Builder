import React from 'react'
import { Layout } from 'antd'

const { Content } = Layout

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content className={className} style={{ padding: '24px' }}>
        {children}
      </Content>
    </Layout>
  )
}

export default PageContainer