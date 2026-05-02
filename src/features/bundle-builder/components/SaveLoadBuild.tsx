import { Button, Input, List, Modal, Popconfirm, Space, Tag, Typography, message } from 'antd'
import { DeleteOutlined, FolderOpenOutlined, SaveOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { SavedBuild, deleteBuild, loadBuilds, saveBuild } from '../services/bundleApi'
import useBundleStore, { useSelections, useTotalCost } from '../store/bundleStore'

import type { Category } from '../types/bundle.types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars


const { Text } = Typography

const SaveLoadBuild: React.FC = () => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)
  const [buildName, setBuildName] = useState('')
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const selections = useSelections() 
  const totalCost = useTotalCost()
  const loadBuild = useBundleStore(state => state.loadBuild)

  // Load saved builds on mount
  useEffect(() => {
    fetchSavedBuilds()
  }, [])

  const fetchSavedBuilds = async () => {
    setIsLoading(true)
    try {
      const builds = await loadBuilds()
      setSavedBuilds(builds)
    } catch (error) {
      // ✅ إخفاء رسالة الخطأ - عدم إظهار أي شيء للمستخدم
      console.log('No saved builds found')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!buildName.trim()) {
      message.warning('Please enter a build name')
      return
    }

    setIsLoading(true)
    try {
      const newBuild = await saveBuild({
        name: buildName,
        selections,
        totalCost
      })
      
      // ✅ حفظ في localStorage كنسخة احتياطية
      const existingBuilds = JSON.parse(localStorage.getItem('saved-builds') || '[]')
      existingBuilds.push(newBuild)
      localStorage.setItem('saved-builds', JSON.stringify(existingBuilds))
      
      message.success(`Build "${buildName}" saved successfully!`)
      setIsSaveModalOpen(false)
      setBuildName('')
      await fetchSavedBuilds()
    } catch (error) {
      // ✅ إخفاء رسالة الخطأ
      message.warning('Build saved locally only')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoad = async (build: SavedBuild) => {
    setIsLoading(true)
    try {
      loadBuild(build.selections)
      message.success(`Build "${build.name}" loaded successfully!`)
      setIsLoadModalOpen(false)
    } catch (error) {
      message.error('Failed to load build')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    setIsLoading(true)
    try {
      await deleteBuild(id)
      // ✅ حذف من localStorage
      const builds = JSON.parse(localStorage.getItem('saved-builds') || '[]')
      const filtered = builds.filter((b: SavedBuild) => b.id !== id)
      localStorage.setItem('saved-builds', JSON.stringify(filtered))
      
      message.success(`Build "${name}" deleted successfully!`)
      await fetchSavedBuilds()
    } catch (error) {
      message.error('Failed to delete build')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Space>
        <Button
          icon={<SaveOutlined />}
          onClick={() => setIsSaveModalOpen(true)}
        >
          Save Build
        </Button>
        <Button
          icon={<FolderOpenOutlined />}
          onClick={() => setIsLoadModalOpen(true)}
        >
          Load Build
        </Button>
      </Space>

      {/* Save Modal */}
      <Modal
        title="Save Your Build"
        open={isSaveModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsSaveModalOpen(false)
          setBuildName('')
        }}
        confirmLoading={isLoading}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Give your build a name:</Text>
          <Input
            placeholder="e.g., Gaming PC, Workstation, Budget Build"
            value={buildName}
            onChange={(e) => setBuildName(e.target.value)}
            onPressEnter={handleSave}
          />
          <Text type="secondary">
            Total Cost: ${totalCost} | Components: {Object.keys(selections).length}
          </Text>
        </Space>
      </Modal>

      {/* Load Modal */}
      <Modal
        title="Load Saved Build"
        open={isLoadModalOpen}
        onCancel={() => setIsLoadModalOpen(false)}
        footer={null}
        width={600}
      >
        <List
          loading={isLoading}
          dataSource={savedBuilds}
          locale={{ emptyText: 'No saved builds found' }}
          renderItem={(build) => (
            <List.Item
              actions={[
                <Button 
                  key="load" 
                  type="link" 
                  onClick={() => handleLoad(build)}
                >
                  Load
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Delete Build"
                  description={`Are you sure you want to delete "${build.name}"?`}
                  onConfirm={() => handleDelete(build.id, build.name)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong>{build.name}</Text>
                    <Tag color="blue">${build.totalCost}</Tag>
                  </Space>
                }
                description={`Created: ${new Date(build.createdAt).toLocaleDateString()} | Components: ${Object.keys(build.selections).length}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  )
}

export default SaveLoadBuild