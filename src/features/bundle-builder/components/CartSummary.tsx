import { Button, Card, Divider, Space, Typography } from 'antd'
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useSelectedItems, useTotalCost } from '../store/bundleStore'

import type { Category } from '../types/bundle.types'
import React from 'react'
import useBundleStore from '../store/bundleStore'

const { Title, Text } = Typography

interface CartSummaryProps {
  onClearAll: () => void
}
  
const CartSummary: React.FC<CartSummaryProps> = ({ onClearAll }) => {
  const selectedItems = useSelectedItems()
  const totalCost = useTotalCost()
  const deselectItem = useBundleStore(state => state.deselectItem)

  const formatPrice = (price: number) => `$${price}`

  const itemsByCategory = selectedItems.reduce((acc, item) => {
    acc[item.category as Category] = item
    return acc
  }, {} as Record<Category, typeof selectedItems[0]>)

  return (
    <Card
      style={{
        background: '#fafafa',
        border: '1px solid #e8e8e8',
        borderRadius: '12px',
        position: 'sticky',
        top: '24px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <ShoppingCartOutlined style={{ fontSize: '20px', color: '#1677ff' }} />
        <Title level={4} style={{ margin: 0 }}>
          Build Summary
        </Title>
      </div>

      {selectedItems.length === 0 ? (
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '32px' }}>
          No components selected
        </Text>
      ) : (
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          {Object.entries(itemsByCategory).map(([category, item]) => (
            <div key={category}>
              <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                {category}
              </Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong style={{ display: 'block' }}>{item.name}</Text>
                  <Text type="secondary" style={{ fontSize: '13px' }}>{formatPrice(item.price)}</Text>
                </div>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => deselectItem(category as Category)}
                  size="small"
                  danger
                />
              </div>
            </div>
          ))}

          <Divider style={{ margin: '8px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Total</Text>
            <Title level={4} style={{ margin: 0, color: '#1677ff' }}>
              {formatPrice(totalCost)}
            </Title>
          </div>

          <Button 
            danger
            block
            style={{ marginTop: '8px' }}
            onClick={onClearAll}
          >
            Clear All
          </Button>
        </Space>
      )}
    </Card>
  )
}

export default CartSummary