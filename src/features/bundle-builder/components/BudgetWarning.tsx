import React from 'react'
import { Alert, Progress, Typography, Space, Card } from 'antd'
import { WarningOutlined, CheckCircleOutlined, DollarOutlined } from '@ant-design/icons'
import { useTotalCost, useRemainingBudget, useBudgetWarning } from '../store/bundleStore'

const { Text, Title } = Typography

const BUDGET_LIMIT = 1000

const BudgetWarning: React.FC = () => {
  const totalCost = useTotalCost()
  const remainingBudget = useRemainingBudget()
  const showWarning = useBudgetWarning()
  
  const percentUsed = Math.min((totalCost / BUDGET_LIMIT) * 100, 100)
  
  // حساب الحالة محلياً بدون استخدام دوال خارجية
  const getBudgetStatus = () => {
    if (totalCost >= BUDGET_LIMIT) return 'error'
    if (totalCost >= BUDGET_LIMIT * 0.8) return 'warning'
    return 'normal'
  }
  
  const getBudgetMessage = () => {
    const remaining = BUDGET_LIMIT - totalCost
    if (remaining < 0) {
      return `Budget exceeded by $${Math.abs(remaining)}`
    }
    if (remaining < 200) {
      return `Only $${remaining} remaining!`
    }
    return `$${remaining} remaining`
  }
  
  const budgetStatus = getBudgetStatus()
  const budgetMessage = getBudgetMessage()
  
  const getStatusColor = () => {
    switch (budgetStatus) {
      case 'error': return '#ff4d4f'
      case 'warning': return '#faad14'
      default: return '#52c41a'
    }
  }
  
  const getProgressStatus = () => {
    switch (budgetStatus) {
      case 'error': return 'exception'
      case 'warning': return 'active'
      default: return 'success'
    }
  }

  return (
    <Card 
      style={{ 
        marginBottom: '24px',
        borderRadius: '12px',
        border: budgetStatus === 'error' ? '1px solid #ff4d4f' : '1px solid #e8e8e8'
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        {/* Header with icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: budgetStatus === 'error' ? '#ff4d4f20' : budgetStatus === 'warning' ? '#faad1420' : '#52c41a20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarOutlined style={{ fontSize: '20px', color: getStatusColor() }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>Budget Limit: ${BUDGET_LIMIT}</Title>
            <Text type="secondary">Track your spending in real-time</Text>
          </div>
        </div>

        {/* Budget numbers */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <Text type="secondary" style={{ fontSize: '14px' }}>Used</Text>
            <Title level={2} style={{ margin: 0, color: totalCost > BUDGET_LIMIT ? '#ff4d4f' : '#1677ff' }}>
              ${totalCost}
            </Title>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>of</Text>
            <Title level={3} style={{ margin: 0 }}>${BUDGET_LIMIT}</Title>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: '14px' }}>Remaining</Text>
            <Title level={2} style={{ margin: 0, color: remainingBudget >= 0 ? '#52c41a' : '#ff4d4f' }}>
              ${Math.max(remainingBudget, 0)}
            </Title>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Text strong>Budget Usage</Text>
            <Text strong style={{ color: getStatusColor() }}>
              {percentUsed.toFixed(0)}%
            </Text>
          </div>
          <Progress
            percent={percentUsed}
            status={getProgressStatus()}
            strokeColor={{
              '0%': '#52c41a',
              '70%': '#faad14',
              '100%': '#ff4d4f',
            }}
            strokeWidth={12}
            showInfo={false}
            trailColor="#f0f0f0"
          />
          {/* Visual markers for budget thresholds */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '4px',
            padding: '0 4px'
          }}>
            <Text type="secondary" style={{ fontSize: '10px' }}>$0</Text>
            <Text type="secondary" style={{ fontSize: '10px' }}>${BUDGET_LIMIT * 0.5}</Text>
            <Text type="secondary" style={{ fontSize: '10px' }}>${BUDGET_LIMIT * 0.8}</Text>
            <Text type="secondary" style={{ fontSize: '10px' }}>$${BUDGET_LIMIT}</Text>
          </div>
        </div>

        {/* Warning Alerts */}
        {showWarning && budgetStatus !== 'error' && budgetStatus === 'warning' && (
          <Alert
            message="⚠️ Budget Warning"
            description={`You have ${budgetMessage}. Be careful with your next selection!`}
            type="warning"
            icon={<WarningOutlined />}
            showIcon
            closable
            style={{ borderRadius: '8px' }}
          />
        )}
        
        {budgetStatus === 'error' && (
          <Alert
            message="❌ Budget Exceeded!"
            description={`${budgetMessage}. Please remove some components to continue.`}
            type="error"
            icon={<WarningOutlined />}
            showIcon
            style={{ borderRadius: '8px' }}
          />
        )}
        
        {totalCost > 0 && budgetStatus === 'normal' && totalCost < BUDGET_LIMIT * 0.8 && (
          <Alert
            message="✅ Budget OK"
            description={`You have ${budgetMessage} available for additional components.`}
            type="success"
            icon={<CheckCircleOutlined />}
            showIcon
            style={{ borderRadius: '8px' }}
          />
        )}

        {/* Friendly tip */}
        {totalCost === 0 && (
          <Alert
            message="💡 Tip"
            description="Select your components and watch the budget bar update in real-time!"
            type="info"
            showIcon
            style={{ borderRadius: '8px' }}
          />
        )}
      </Space>
    </Card>
  )
}

export default BudgetWarning