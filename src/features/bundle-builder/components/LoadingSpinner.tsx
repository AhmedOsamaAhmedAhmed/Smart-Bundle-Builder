/* eslint-disable @typescript-eslint/no-unused-vars */

import { Space, Spin, Typography } from 'antd'

import { LoadingOutlined } from '@ant-design/icons'
import React from 'react'

const { Text } = Typography

interface LoadingSpinnerProps {
  tip?: string
  fullScreen?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  tip = 'Loading...', 
  fullScreen = false 
}) => { 
  const spinner = (
    <Space direction="vertical" align="center" size="middle">
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} 
        tip={tip}
        size="large"
      />
    </Space>
  )

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
      }}>
        {spinner}
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      minHeight: '200px',
    }}>
      {spinner}
    </div>
  )
}

export default LoadingSpinner