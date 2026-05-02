import { ConfigProvider, theme as antdTheme } from 'antd'

import { AccessibilityProvider } from './providers/AccessibilityProvider'
import BuilderLayout from '../features/bundle-builder/components/BuilderLayout'

function App() {
  return (
    <AccessibilityProvider>
      <ConfigProvider
        theme={{
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 8,
            fontSize: 14,
          },
        }}
      >
        <BuilderLayout />
      </ConfigProvider>
    </AccessibilityProvider>
  )
}

export default App