/* eslint-disable @typescript-eslint/no-unused-vars */

import { Button, Card, Space, Tooltip, Typography } from 'antd'
import { CheckCircleOutlined, ThunderboltOutlined, WarningOutlined } from '@ant-design/icons'
import React, { useEffect, useRef } from 'react'
import useBundleStore, { useIsLoading } from '../store/bundleStore'

import type { Category } from '../types/bundle.types'

const { Text } = Typography

interface CategorySectionProps {
  category: Category
  selectedProductId: string | null
}
  
const CategorySection: React.FC<CategorySectionProps> = ({ 
  category, 
  selectedProductId 
}) => {
  const products = useBundleStore(state => state.products)
  const selectItem = useBundleStore(state => state.selectItem)
  const deselectItem = useBundleStore(state => state.deselectItem)
  const checkCompatibility = useBundleStore(state => state.checkCompatibility)
  const isLoading = useIsLoading()
  
  const sectionRef = useRef<HTMLDivElement>(null)
  const categoryProducts = products.filter(p => p.category === category)
  const formatPrice = (price: number) => `$${price}`

  // Announce changes to screen readers
  useEffect(() => {
    if (selectedProductId) {
      const selectedProduct = categoryProducts.find(p => p.id === selectedProductId)
      if (selectedProduct) {
        const announcement = `${selectedProduct.name} selected for ${category}`
        const liveRegion = document.getElementById('a11y-live-region')
        if (liveRegion) {
          liveRegion.textContent = announcement
          setTimeout(() => {
            if (liveRegion) liveRegion.textContent = ''
          }, 1000)
        }
      }
    }
  }, [selectedProductId, category, categoryProducts])

  const handleSelect = (productId: string) => {
    if (isLoading) return
    if (selectedProductId === productId) {
      deselectItem(category)
    } else {
      selectItem(category, productId)
    }
  }
  
  const isProductDisabled = (productId: string): boolean => {
    if (selectedProductId === productId) return false
    return !checkCompatibility(productId)
  }

  const getDisabledReason = (productId: string): string => {
    const product = categoryProducts.find(p => p.id === productId)
    if (!product) return 'Item not available'
    return `${product.name} is not compatible with your current selection`
  }

  if (categoryProducts.length === 0) {
    return (
      <div role="status" aria-live="polite">
        <Text type="secondary">No products available in {category} category</Text>
      </div>
    )
  }

  return (
    <div 
      ref={sectionRef}
      role="region"
      aria-label={`${category} category, choose one component`}
      style={{ width: '100%' }}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {/* ✅ تم إزالة index غير المستخدم */}
        {categoryProducts.map((product) => {
          const isSelected = selectedProductId === product.id
          const isDisabled = isProductDisabled(product.id)
          const hasIncompatibilities = product.incompatibleWith.length > 0
          const disabledReason = getDisabledReason(product.id)
          
          return (
            <div
              key={product.id}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              aria-label={`${product.name}, ${formatPrice(product.price)}${hasIncompatibilities ? ', has compatibility restrictions' : ''}${isDisabled ? ', not available' : ''}`}
              style={{ width: '100%' }}
            >
              <Card
                size="small"
                style={{
                  border: isSelected ? '2px solid #1677ff' : '1px solid #e8e8e8',
                  background: isSelected ? '#f0f7ff' : isDisabled ? '#f5f5f5' : 'white',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
                hoverable={!isDisabled && !isSelected}
                onClick={() => !isDisabled && handleSelect(product.id)}
                onKeyDown={(e) => {
                  if (isDisabled) return
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelect(product.id)
                  }
                }}
                tabIndex={isDisabled ? -1 : 0}
                role="presentation"
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Text strong style={{ fontSize: '15px' }}>
                        {product.name}
                      </Text>
                      {hasIncompatibilities && !isSelected && (
                        <Tooltip title="This component has compatibility restrictions">
                          <ThunderboltOutlined 
                            style={{ color: '#faad14', fontSize: '14px' }}
                            aria-label="Has compatibility restrictions"
                          />
                        </Tooltip>
                      )}
                      {isDisabled && (
                        <Tooltip title="Incompatible with current selection">
                          <WarningOutlined 
                            style={{ color: '#ff4d4f', fontSize: '14px' }}
                            aria-label="Not compatible"
                          />
                        </Tooltip>
                      )}
                    </div>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      {formatPrice(product.price)}
                    </Text>
                  </div>
                  <Button
                    type={isSelected ? 'primary' : 'default'}
                    icon={isSelected ? <CheckCircleOutlined /> : null}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!isDisabled) handleSelect(product.id)
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    disabled={isDisabled}
                    style={{ minWidth: '90px' }}
                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${product.name}`}
                    aria-describedby={isDisabled ? `disabled-reason-${product.id}` : undefined}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </Card>
              {isDisabled && (
                <div id={`disabled-reason-${product.id}`} style={{ display: 'none' }}>
                  {disabledReason}
                </div>
              )}
            </div>
          )
        })}
      </Space>
    </div>
  )
}

export default CategorySection