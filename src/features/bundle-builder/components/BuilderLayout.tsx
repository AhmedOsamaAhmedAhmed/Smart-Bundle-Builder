import { Alert, Button, Card, Col, Divider, Row, Space, Typography, message } from 'antd'
import {
  CloudDownloadOutlined,
  DollarOutlined,
  LockOutlined,
  MoonOutlined,
  PrinterOutlined,
  ShoppingOutlined,
  SmileOutlined,
  SunOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import React, { useEffect } from 'react'
import useBundleStore, { useError, useIsLoading, useSelectedItems, useSelections, useTotalCost, useWarning } from '../store/bundleStore'

import BudgetWarning from './BudgetWarning'
import CartSummary from './CartSummary'
import type { Category } from '../types/bundle.types'
import CategorySection from './CategorySection'
import LoadingSpinner from './LoadingSpinner'
import SaveLoadBuild from './SaveLoadBuild'
import UndoRedoControls from './UndoRedoControls'
import { categories } from '../data/mockProducts'
import { exportToPDF } from '../services/pdfExport'
import { fetchProducts } from '../services/bundleApi'
import { useTheme } from '../hooks/useTheme'

// ✅ removed useState














const { Title, Text } = Typography

const BuilderLayout: React.FC = () => {
  const { clearAllSelections, setLoading, setError } = useBundleStore()
  const selections = useSelections()
  const selectedItems = useSelectedItems()
  const totalCost = useTotalCost()
  const error = useError()
  const warning = useWarning()
  const isLoading = useIsLoading()
  const { mode, toggleTheme } = useTheme()

  // Load products from API on mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const products = await fetchProducts()
        useBundleStore.setState({ products })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.error('Failed to load products from API, using mock data')
        message.warning('Using local data - API not available')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleExportPDF = () => {
    if (selectedItems.length === 0) {
      message.warning('No components selected to export')
      return
    }
    exportToPDF(selectedItems, totalCost)
  }

  if (isLoading) {
    return <LoadingSpinner tip="Loading products..." fullScreen />
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '40px 24px',
      background: mode === 'dark' ? '#141414' : '#fff',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <ShoppingOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
        <Title level={1} style={{ fontSize: '32px', marginBottom: '8px', margin: 0 }}>
          Smart Bundle Builder
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Build your perfect tech setup within ${1000} budget
        </Text>
      </div>

      {/* Controls Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <UndoRedoControls />
          <SaveLoadBuild />
        </div>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button
            icon={mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
          >
            {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>
          <Button
            icon={<PrinterOutlined />}
            onClick={handleExportPDF}
            disabled={selectedItems.length === 0}
          >
            Export PDF
          </Button>
          <Button
            icon={<CloudDownloadOutlined />}
            onClick={() => message.info('Cloud save feature coming soon!')}
          >
            Cloud Backup
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: '16px', borderRadius: '8px' }}
        />
      )}

      {/* Warning Alert */}
      {warning && (
        <Alert
          message="Warning"
          description={warning}
          type="warning"
          showIcon
          closable
          onClose={() => useBundleStore.getState().setWarning(null)}
          style={{ marginBottom: '16px', borderRadius: '8px' }}
        />
      )}

      {/* Budget Warning Component with Progress Bar */}
      <BudgetWarning />

      <Row gutter={[48, 32]}>
        {/* Left Column - Categories */}
        <Col xs={24} lg={14}>
          <Space direction="vertical" size={40} style={{ width: '100%' }}>
            {categories.map((category, index) => (
              <div key={category}>
                <Title level={4} style={{ marginBottom: '16px' }}>
                  {index + 1}. {category} <Text type="secondary" style={{ fontSize: '14px' }}>(Choose 1)</Text>
                </Title>
                <CategorySection
                  category={category as Category}
                  selectedProductId={selections[category as Category] || null}
                />
              </div>
            ))}
          </Space>

          {/* Add More Categories Button */}
          <Card 
            style={{ 
              marginTop: '32px', 
              textAlign: 'center',
              background: mode === 'dark' ? '#1f1f1f' : '#fafafa',
              border: '1px dashed #d9d9d9',
              cursor: 'pointer'
            }}
            hoverable
            onClick={() => message.info('More categories coming soon!')}
          >
            <Text strong style={{ color: '#1677ff' }}>+ Add More Categories</Text>
          </Card>
        </Col>

        {/* Right Column - Summary */}
        <Col xs={24} lg={10}>
          <CartSummary onClearAll={clearAllSelections} />
        </Col>
      </Row>

      {/* Features Section */}
      <Divider style={{ margin: '64px 0 48px' }} />
      
      <Row gutter={[24, 32]}>
        <Col xs={24} sm={12} md={6}>
          <div style={{ textAlign: 'center' }}>
            <ThunderboltOutlined style={{ fontSize: '40px', color: '#1677ff', marginBottom: '16px' }} />
            <Title level={5} style={{ marginBottom: '8px' }}>Compatibility Check</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              We automatically prevent incompatible selections
            </Text>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ textAlign: 'center' }}>
            <DollarOutlined style={{ fontSize: '40px', color: '#1677ff', marginBottom: '16px' }} />
            <Title level={5} style={{ marginBottom: '8px' }}>Budget Control</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              Real-time budget tracking with progress bar
            </Text>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ textAlign: 'center' }}>
            <SmileOutlined style={{ fontSize: '40px', color: '#1677ff', marginBottom: '16px' }} />
            <Title level={5} style={{ marginBottom: '8px' }}>Easy to Use</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              Simple, fast and beautiful experience
            </Text>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ textAlign: 'center' }}>
            <LockOutlined style={{ fontSize: '40px', color: '#1677ff', marginBottom: '16px' }} />
            <Title level={5} style={{ marginBottom: '8px' }}>Secure & Private</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              Your builds are private and secure
            </Text>
          </div>
        </Col>
      </Row>

      {/* Footer */}
      <Divider style={{ margin: '48px 0 24px' }} />
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Text type="secondary">
          © 2024 Smart Bundle Builder | Budget Limit: ${1000} | Build your perfect tech setup
        </Text>
      </div>
    </div>
  )
}

export default BuilderLayout